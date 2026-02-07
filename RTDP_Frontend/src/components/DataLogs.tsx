import React, { useRef } from 'react';
import { useVirtualizer } from '@tanstack/react-virtual';
import { format } from 'date-fns';
import { FaExclamationCircle, FaInfoCircle, FaExclamationTriangle } from 'react-icons/fa';
import type { LogEntry } from '../types/types';

interface Props {
    logs: LogEntry[];
}

const DataLogs: React.FC<Props> = ({ logs }) => {
    // 1. The Scroll Container Ref
    const parentRef = useRef<HTMLDivElement>(null);

    // 2. Initialize Virtualizer
    const rowVirtualizer = useVirtualizer({
        count: logs.length,
        getScrollElement: () => parentRef.current,
        estimateSize: () => 80, // Approximate height of a row
        overscan: 5, // Render 5 extra items off-screen for smoothness
    });

    const getIcon = (severity: string) => {
        switch (severity) {
            case 'ERROR': return <FaExclamationCircle className="text-error-main" />;
            case 'WARNING': return <FaExclamationTriangle className="text-warn-main" />;
            default: return <FaInfoCircle className="text-primary-main" />;
        }
    };

    const getBorderColor = (severity: string) => {
        switch (severity) {
            case 'ERROR': return 'border-l-error-main';
            case 'WARNING': return 'border-l-warn-main';
            default: return 'border-l-primary-main';
        }
    };

    return (
        // Parent container must have a defined height and overflow
        <div
            ref={parentRef}
            className="h-[600px] w-full bg-background-main dark:bg-background-inverse rounded-lg border border-border-light dark:border-border-dark overflow-y-auto contain-strict"
        >
            {/* The "Track" - total calculated height of all items */}
            <div
                style={{
                    height: `${rowVirtualizer.getTotalSize()}px`,
                    width: '100%',
                    position: 'relative',
                }}
            >
                {/* The "Items" - only the visible ones are rendered */}
                {rowVirtualizer.getVirtualItems().map((virtualItem) => {
                    const log = logs[virtualItem.index];
                    return (
                        <div
                            key={virtualItem.key}
                            style={{
                                position: 'absolute',
                                top: 0,
                                left: 0,
                                width: '100%',
                                height: `${virtualItem.size}px`,
                                transform: `translateY(${virtualItem.start}px)`,
                            }}
                            className="px-4 py-2"
                        >
                            <div className={`flex items-center p-3 h-full bg-background-light dark:bg-dark-main shadow-sm rounded border-l-4 ${getBorderColor(log.severity)} hover:bg-background-main transition-colors`}>
                                <div className="mr-4 text-xl">
                                    {getIcon(log.severity)}
                                </div>
                                <div className="flex-1 min-w-0">
                                    <div className="flex justify-between items-baseline mb-1">
                                        <span className="text-sm font-bold text-text-main dark:text-text-inverse">{log.source}</span>
                                        <span className="text-xs text-muted-light font-mono">
                                            {format(new Date(log.timestamp), 'HH:mm:ss.SSS')}
                                        </span>
                                    </div>
                                    <p className="text-sm text-muted-main dark:text-muted-dark truncate">{log.message}</p>
                                </div>
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
};

export default DataLogs;