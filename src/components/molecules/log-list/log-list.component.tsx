import { collection, limit, orderBy, query } from "firebase/firestore";
import { FC } from "react";
import { useFirestore, useFirestoreCollectionData } from "reactfire";
import { LogsContainer } from "./log-list.styles";
import { Log, LogItem } from "../../atoms/log-item/log-item.component";
import { LogVariant } from "../../atoms/log-item/log-item.styles";

export const LogList: FC = () => {
  const firestore = useFirestore();
  const logsCollection = collection(firestore, "logs");
  const logsQuery = query(
    logsCollection,
    orderBy("timestamp", "desc"),
    limit(20)
  );

  const { status, data } = useFirestoreCollectionData(logsQuery, {
    idField: "key",
  });

  if (status === "loading") {
    return <span>Loading</span>;
  }

  if (status === "error") {
    return <span>Something went wrong</span>;
  }

  const logsData = data as Log[];

  return (
    <LogsContainer>
      {logsData.map((log) => {
        let variant: LogVariant = "unknown";
        if (!log.accessed && log.user) {
          variant = "failed";
        } else if (log.accessed && log.user) {
          variant = log.bluetooth ? "bluetooth" : "success";
        }

        return (
          <LogItem key={log.timestamp.toMillis()} variant={variant} log={log} />
        );
      })}
    </LogsContainer>
  );
};
