/* eslint-disable @typescript-eslint/no-non-null-assertion */
import { FC } from "react";

import { DocumentReference, Timestamp } from "firebase/firestore";
import {
  useDatabase,
  useDatabaseListData,
  useFirestoreDocData,
} from "reactfire";

import {
  Log,
  LogName,
  LogTimestamp,
  LogVariant,
  TimestampContainer,
} from "./log-item.styles";
import { format } from "date-fns";
import { equalTo, orderByChild, query, ref } from "firebase/database";

export interface Attempt {
  csiId: string;
  passcode: string;
}

/**
 * @deprecated
 */
export interface LegacyLog {
  csiId: number;
  dateTime: Date;
  accessed: boolean;
  bluetooth?: boolean;
  attemptData?: Attempt;
}

export interface Log {
  user?: DocumentReference<CSIUser>;
  accessed: boolean;
  bluetooth: boolean;
  timestamp: Timestamp;
  attemptData?: Attempt;
  room: DocumentReference;
}

/**
 * @deprecated
 */
export interface LegacyLog {
  csiId: number;
  timestamp: number;
  accessed: boolean;
  bluetooth?: boolean;
  attemptData?: {
    csiId: string;
    passcode: string;
  };
}

export interface CSIUser {
  unisonId: string;
  csiId: number;
  email: string;
  name: string;
  passcode: string;
  role: DocumentReference;
  isAllowedAccess: boolean;
  createdAt: Timestamp;
  dateOfBirth: Timestamp;
}

/**
 * @deprecated
 */
export interface LegacyUser {
  name: string;
  csiId: number;
}

export interface LogItemProps {
  log: Log | LegacyLog;
  variant: LogVariant;
}

export const LogItem: FC<LogItemProps> = ({ log, variant }) => {
  if (variant === "unknown") {
    return <UnknownLog log={log} />;
  }

  if (!(log.timestamp instanceof Timestamp)) {
    return <LegacyLog log={log} variant={variant} />;
  }

  return <_LogItem log={log} variant={variant} />;
};

const _LogItem: FC<LogItemProps> = ({ log, variant }) => {
  const logItem = log as Log;
  const { status, data: userData } = useFirestoreDocData<CSIUser>(
    logItem.user!
  );

  if (status === "loading") {
    return <span>Loading</span>;
  }

  if (status === "error") {
    return <span>Something went wrong</span>;
  }

  const timestamp = logItem.timestamp.toDate();

  return (
    <Log variant={variant}>
      <LogName>{userData.name}</LogName>
      <TimestampContainer variant={variant}>
        <LogTimestamp>{format(timestamp, "HH:mm:ss")}</LogTimestamp>
        <LogTimestamp>{format(timestamp, "MMMM dd yyyy")}</LogTimestamp>
      </TimestampContainer>
    </Log>
  );
};

// const BluetoothLog: FC<Pick<LogItemProps, "log">> = ({ log }) => {
//   const logItem = log as Log;
//   const { status, data: userData } = useFirestoreDocData<CSIUser>(
//     logItem.user!
//   );

//   if (status === "loading") {
//     return <span>Loading</span>;
//   }

//   if (status === "error") {
//     return <span>Something went wrong</span>;
//   }

//   const timestamp = logItem.timestamp.toDate();

//   return (
//     <Log variant="bluetooth">
//       <LogName>{userData.name}</LogName>
//       <TimestampContainer variant="bluetooth">
//         <LogTimestamp>{format(timestamp, "HH:mm:ss")}</LogTimestamp>
//         <LogTimestamp>{format(timestamp, "MMMM dd yyyy")}</LogTimestamp>
//       </TimestampContainer>
//     </Log>
//   );
// };

// const FailedLog: FC<Pick<LogItemProps, "log">> = ({ log }) => {
//   const logItem = log as Log;
//   const { status, data: userData } = useFirestoreDocData<CSIUser>(
//     logItem.user!
//   );

//   if (status === "loading") {
//     return <span>Loading</span>;
//   }

//   if (status === "error") {
//     return <span>Something went wrong</span>;
//   }

//   const timestamp = logItem.timestamp.toDate();

//   return (
//     <Log variant="failed">
//       <LogName>{userData.name}</LogName>
//       <TimestampContainer variant="failed">
//         <LogTimestamp>{format(timestamp, "HH:mm:ss")}</LogTimestamp>
//         <LogTimestamp>{format(timestamp, "MMMM dd yyyy")}</LogTimestamp>
//       </TimestampContainer>
//     </Log>
//   );
// };

const UnknownLog: FC<Pick<LogItemProps, "log">> = ({ log }) => {
  const logItem = log as Log;
  const timestamp = logItem.timestamp.toDate();

  return (
    <Log variant="unknown">
      <LogName>Unknown user</LogName>
      <TimestampContainer variant="unknown">
        <LogTimestamp>{format(timestamp, "HH:mm:ss")}</LogTimestamp>
        <LogTimestamp>{format(timestamp, "MMMM dd yyyy")}</LogTimestamp>
      </TimestampContainer>
    </Log>
  );
};

/**
 * @deprecated
 */
const LegacyLog: FC<LogItemProps> = ({ log, variant }) => {
  const logItem = log as LegacyLog;
  const database = useDatabase();

  const usersRef = ref(database, `users`);
  const usersQuery = query(
    usersRef,
    orderByChild("csiId"),
    equalTo(logItem.csiId)
  );
  const { status, data: user } = useDatabaseListData<LegacyUser>(usersQuery);

  if (status === "loading") {
    return <span>Loading...</span>;
  }

  if (status === "error") {
    return <span>Something went wrong</span>;
  }

  let userName = "Unknown user";
  const timestamp = new Date(logItem.timestamp);
  if (user && user[0]) {
    userName = user[0].name;
  }

  return (
    <Log variant={variant} isLegacy={true}>
      <LogName>{userName}</LogName>
      <TimestampContainer variant={variant}>
        <LogTimestamp>{format(timestamp, "HH:mm:ss")}</LogTimestamp>
        <LogTimestamp>{format(timestamp, "MMMM dd yyyy")}</LogTimestamp>
      </TimestampContainer>
    </Log>
  );
};
