interface StatusBarProps {
  isOffline: boolean;
  pendingTransactions: number;
}

export function StatusBar({ isOffline, pendingTransactions }: StatusBarProps) {
  return (
    <header className="status-bar">
      <h1>Supermarket POS</h1>
      <div className="status-meta">
        <span className={isOffline ? "badge badge-offline" : "badge badge-online"}>
          {isOffline ? "Offline mode" : "Online"}
        </span>
        <span className="badge badge-pending">Pending sync: {pendingTransactions}</span>
      </div>
    </header>
  );
}
