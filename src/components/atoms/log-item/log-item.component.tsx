/* eslint-disable @typescript-eslint/no-non-null-assertion */
import { FC } from "react";

import { DocumentReference, Timestamp } from "firebase/firestore";
import { useFirestore, useFirestoreDocData } from "reactfire";

import {
  Log,
  LogName,
  LogTimestamp,
  LogVariant,
  TimestampContainer,
} from "./log-item.styles";
import { format } from "date-fns";

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

export interface LogItemProps {
  log: Log;
  variant: LogVariant;
}

export const LogItem: FC<LogItemProps> = ({ log, variant }) => {
  switch (variant) {
    case "success":
      return <SuccessfulLog log={log} />;
    case "bluetooth":
      return <BluetoothLog log={log} />;
    case "failed":
      return <FailedLog log={log} />;
    default:
      return <UnknownLog log={log} />;
  }
};

const SuccessfulLog: FC<Pick<LogItemProps, "log">> = ({ log }) => {
  const { status, data: userData } = useFirestoreDocData<CSIUser>(log.user!);

  if (status === "loading") {
    return <span>Loading</span>;
  }

  if (status === "error") {
    return <span>Something went wrong</span>;
  }

  const timestamp = log.timestamp.toDate();

  return (
    <Log variant="success">
      <LogName>{userData.name}</LogName>
      <TimestampContainer variant="success">
        <LogTimestamp>{format(timestamp, "HH:mm:ss")}</LogTimestamp>
        <LogTimestamp>{format(timestamp, "MMMM dd yyyy")}</LogTimestamp>
      </TimestampContainer>
    </Log>
  );
};

const BluetoothLog: FC<Pick<LogItemProps, "log">> = ({ log }) => {
  const { status, data: userData } = useFirestoreDocData<CSIUser>(log.user!);

  if (status === "loading") {
    return <span>Loading</span>;
  }

  if (status === "error") {
    return <span>Something went wrong</span>;
  }

  const timestamp = log.timestamp.toDate();

  return (
    <Log variant="bluetooth">
      <LogName>{userData.name}</LogName>
      <TimestampContainer variant="bluetooth">
        <LogTimestamp>{format(timestamp, "HH:mm:ss")}</LogTimestamp>
        <LogTimestamp>{format(timestamp, "MMMM dd yyyy")}</LogTimestamp>
      </TimestampContainer>
    </Log>
  );
};

const FailedLog: FC<Pick<LogItemProps, "log">> = ({ log }) => {
  const { status, data: userData } = useFirestoreDocData<CSIUser>(log.user!);

  if (status === "loading") {
    return <span>Loading</span>;
  }

  if (status === "error") {
    return <span>Something went wrong</span>;
  }

  const timestamp = log.timestamp.toDate();

  return (
    <Log variant="failed">
      <LogName>{userData.name}</LogName>
      <TimestampContainer variant="failed">
        <LogTimestamp>{format(timestamp, "HH:mm:ss")}</LogTimestamp>
        <LogTimestamp>{format(timestamp, "MMMM dd yyyy")}</LogTimestamp>
      </TimestampContainer>
    </Log>
  );
};

const UnknownLog: FC<Pick<LogItemProps, "log">> = ({ log }) => {
  const timestamp = log.timestamp.toDate();

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
