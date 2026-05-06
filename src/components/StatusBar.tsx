interface StatusBarProps {
  isOffline: boolean;
  pendingTransactions: number;
}

export function StatusBar({ isOffline, pendingTransactions }: StatusBarProps) {
  return (
    <header className="status-bar">
      <h1>Supermarket POS</h1>
      <div className="status-meta">
        {isOffline ? (
          <span className="badge badge-offline">Sin conexión</span>
        ) : (
          <span className="badge badge-online">En línea</span>
        )}
        {pendingTransactions > 0 && (
          <span className="badge badge-pending">
            {pendingTransactions} pendiente{pendingTransactions > 1 ? "s" : ""}
          </span>
        )}
      </div>
    </header>
  );
}
