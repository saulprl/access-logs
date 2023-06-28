import { FC } from "react";

import {
  useDatabase,
  useDatabaseListData,
  useFirestore,
  useFirestoreCollectionData,
} from "reactfire";
import {
  Timestamp,
  collection,
  limit,
  orderBy,
  query,
} from "firebase/firestore";

import {
  type LegacyLog,
  type Log,
  LogItem,
} from "../../atoms/log-item/log-item.component";
import { LogVariant } from "../../atoms/log-item/log-item.styles";

import { LogsContainer } from "./log-list.styles";
import {
  query as dbQuery,
  limitToLast as dbLimitToLast,
  orderByChild,
  ref,
} from "firebase/database";

export const LogList: FC = () => {
  const database = useDatabase();
  const firestore = useFirestore();
  const logsCollection = collection(firestore, "logs");
  const logsQuery = query(
    logsCollection,
    orderBy("timestamp", "desc"),
    limit(20)
  );

  const dbLogsRef = ref(database, "history");
  const dbLogsQuery = dbQuery(
    dbLogsRef,
    orderByChild("timestamp"),
    dbLimitToLast(20)
  );

  const { status: firestoreStatus, data: firestoreData } =
    useFirestoreCollectionData(logsQuery, { idField: "key" });
  const { status: dbStatus, data: dbData } = useDatabaseListData<
    LegacyLog | undefined
  >(dbLogsQuery, { idField: "id" });

  if (firestoreStatus === "loading" || dbStatus === "loading") {
    return <span>Loading</span>;
  }

  if (firestoreStatus === "error" || dbStatus === "error") {
    return <span>Something went wrong</span>;
  }

  const logsData = firestoreData as Log[];
  const dbLogsData = dbData ? dbData : [];
  const mergedLogs = [...logsData, ...dbLogsData];
  mergedLogs.sort((logA, logB) => {
    if (!logA || !logB) return 0;

    const timestampA =
      logA.timestamp instanceof Timestamp
        ? logA.timestamp.toDate().getTime()
        : logA.timestamp;
    const timestampB =
      logB.timestamp instanceof Timestamp
        ? logB.timestamp.toDate().getTime()
        : logB.timestamp;

    if (timestampA > timestampB) {
      return -1;
    }

    return 1;
  });

  return (
    <LogsContainer>
      {mergedLogs.map((log) => {
        if (!log) return;

        const isLegacy = !(log.timestamp instanceof Timestamp);
        const logItem = isLegacy ? (log as LegacyLog) : (log as Log);
        const key = !isLegacy
          ? (logItem.timestamp as Timestamp).toDate().getTime()
          : (logItem as LegacyLog).timestamp;

        let variant: LogVariant = "unknown";
        if (!log.accessed) {
          variant = isLegacy
            ? "failed"
            : (log as Log).user
            ? "failed"
            : "unknown";
        } else if (log.accessed) {
          variant = isLegacy
            ? log.bluetooth
              ? "bluetooth"
              : "success"
            : (log as Log).user
            ? log.bluetooth
              ? "bluetooth"
              : "success"
            : "unknown";
        }

        return <LogItem key={key} variant={variant} log={logItem} />;
      })}
    </LogsContainer>
  );
};
