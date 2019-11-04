using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;
using Tracer;

public interface TransactionPlayerSettings
{
    int speedMultiplier { get; set; }
    int lookAheadSize { get; set; }
    int loadChunkSize { get; set; } // Always make sure this is greater than look ahead
    int updateInterval { get; set; }
    int loadInterval { get; set; }
    bool customIncrementer { get; set; }
}

public enum TransactionPlayerState
{
    Paused,
    Playing,
}

public abstract class TransactionPlayer
{
    private bool loadingChunk = false;
    private int internalLoadPosition = 0;
    private int internalPosition = 0;
    private int previousPosition = -1;
    private TraceProject project = null;
    private TransactionPlayerState internalState = TransactionPlayerState.Paused;
    private Timer internalUpdateInterval = null;
    private Timer internalLoadInterval = null;
    private List<TraceTransactionLog> transactionLogs = new List<TraceTransactionLog>();
    private int transactionLogIndex = 0;

    TransactionPlayerSettings settings;
    ProjectLoader projectLoader;
    TransactionLoader transactionLoader;

    Guid projectId;

    public bool isBuffering
    {
        get
        {
            return internalPosition >= internalLoadPosition;
        }
    }

    public TransactionPlayer(
        TransactionPlayerSettings settings,
        ProjectLoader projectLoader,
        TransactionLoader transactionLoader,
        Guid projectId)
    {
        this.settings = settings;
        this.projectLoader = projectLoader;
        this.transactionLoader = transactionLoader;

        if (settings.loadChunkSize <= settings.lookAheadSize)
        {
            throw new System.ArgumentException("loadChunkSize cannot be smaller than or as small as lookAheadSize", "loadChunkSize");
        }
    }

    public async Task Load()
    {
        project = await projectLoader.LoadProject(this.projectId);
        if (!this.settings.customIncrementer)
        {
            internalUpdateInterval = new Timer(this.UpdateLoop, null, 0, settings.updateInterval);
        }
        internalLoadInterval = new Timer(this.LoadLoop, null, 0, this.settings.loadInterval);
        LoadLoop(null);
    }

    public void Dispose()
    {
        if (internalUpdateInterval != null)
        {
            internalUpdateInterval.Dispose();
            internalUpdateInterval = null;
        }
        if (internalLoadInterval != null)
        {
            internalLoadInterval.Dispose();
            internalLoadInterval = null;
        }
    }

    public void Play()
    {
        ThrowIfNotLoaded();
        internalState = TransactionPlayerState.Playing;
    }

    public void Pause()
    {
        ThrowIfNotLoaded();

        internalState = TransactionPlayerState.Paused;
        internalPosition = previousPosition; // Snap to where we actually are
    }

    protected void ThrowIfNotLoaded()
    {
        if (project == null)
        {
            throw new System.InvalidOperationException("Project isn't loaded yet");
        }
    }

    protected async void LoadLoop(Object stateInfo)
    {
        if (loadingChunk || project == null)
        {
            return;
        }

        if (internalLoadPosition > internalPosition + settings.lookAheadSize)
        {
            return;
        }

        if (internalLoadPosition >= project.Duration)
        {
            return;
        }

        loadingChunk = true;

        var start = internalLoadPosition;
        var end = start + (settings.loadChunkSize);
        var loadedTransactions = await transactionLoader.GetTransactionLogs(project, start, end);
        transactionLogs.AddRange(loadedTransactions);
        internalLoadPosition = end;
        loadingChunk = false;
    }

    protected async void UpdateLoop(Object stateInfo)
    {
        if (previousPosition == internalPosition && internalState == TransactionPlayerState.Paused)
        {
            return;
        }

        if (isBuffering)
        {
            return;
        }

        // Handle rewind
        var lastTransactionOffset = 0;
        var lastActedTransactionOffset = previousPosition;
        if (internalPosition < previousPosition)
        {
            while (internalPosition < previousPosition && transactionLogIndex >= 0)
            {
                var currentTransactionLog = transactionLogs[transactionLogIndex];
                --transactionLogIndex;
                if (currentTransactionLog == null)
                {
                    continue;
                }

                foreach (var transaction in currentTransactionLog.Transactions.Reverse().ToArray())
                {
                    lastTransactionOffset = (int)transaction.TimeOffsetMs;
                    if (lastTransactionOffset <= previousPosition && lastTransactionOffset > internalPosition)
                    {
                        await HandleTransaction(transaction, true);
                        lastActedTransactionOffset = lastTransactionOffset;
                    }
                }
                previousPosition = lastActedTransactionOffset;
            }
            previousPosition = internalPosition;
        }

        var currentTransaction = FindCurrentPlayTransaction();
        var passedLoader = internalPosition >= internalLoadPosition;
        if (currentTransaction == null)
        {
            if (!passedLoader && internalPosition <= project.Duration)
            {
                internalPosition += settings.updateInterval;
            }
            return;
        }

        lastTransactionOffset = 0;
        lastActedTransactionOffset = 0;
        foreach (var transaction in currentTransaction.Transactions)
        {
            lastTransactionOffset = (int)transaction.TimeOffsetMs;
            if (lastTransactionOffset > previousPosition && lastTransactionOffset <= internalPosition)
            {
                await HandleTransaction(transaction);
                lastActedTransactionOffset = lastTransactionOffset;
            }
        }

        if (previousPosition < lastActedTransactionOffset)
        {
            previousPosition = lastActedTransactionOffset;
        }

        if (!settings.customIncrementer)
        {
            internalPosition += settings.updateInterval;
        }
    }

    protected TraceTransactionLog FindCurrentPlayTransaction()
    {
        if (transactionLogIndex < 0)
        {
            transactionLogIndex = 0;
        }

        TraceTransactionLog currentTransactionLog = null;
        if (transactionLogs.Count < transactionLogIndex)
        {
            currentTransactionLog = transactionLogs[transactionLogIndex];
            if (currentTransactionLog == null)
            {
                if (transactionLogs.Count > 0 && transactionLogs[transactionLogIndex - 1].Partition >=
                    (project.Duration / project.PartitionSize))
                {
                    // Pause();
                }
                return null;
            }
        }

        var transactionList = currentTransactionLog.Transactions;
        if (transactionList.Count == 0 || transactionList[transactionList.Count - 1].TimeOffsetMs <= previousPosition)
        {
            ++transactionLogIndex;
            return FindCurrentPlayTransaction();
        }

        return currentTransactionLog;
    }

    protected abstract Task HandleTransaction(TraceTransaction transaction, bool undo = false);
}
