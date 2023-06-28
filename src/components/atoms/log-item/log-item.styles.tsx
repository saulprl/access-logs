import { css, Keyframes, keyframes, Theme } from "@emotion/react";
import styled from "@emotion/styled";

export type LogVariant = "success" | "failed" | "bluetooth" | "unknown";

const logStyles = ({ theme }: { theme: Theme }) => css`
  background-color: ${theme.colors.primary};
  border-radius: ${theme.sizes.borderRadius};
  font-family: ${theme.fonts.main};
  font-weight: bold;
  font-size: 16px;
  color: white;

  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 100%;

  margin: 0 0 0.5rem;
  padding: 0.5rem 1rem;
`;

const flashSuccess = ({ theme }: { theme: Theme }) => keyframes`
  0%, 50%, 100% {
    background-color: ${theme.colors.primary};
  }

  25%, 75% {
    background-color: ${theme.colors.success};
  }
`;

const flashBluetooth = ({ theme }: { theme: Theme }) => keyframes`
  0%, 50%, 100% {
    background-position: 0% 0%;
  }

  25%, 75% {
    background-position: 75% 75%;
  }
`;

const flashFailed = ({ theme }: { theme: Theme }) => keyframes`
  0%, 50%, 100% {
    background-color: ${theme.colors.error};
  }

  25%, 75% {
    background-color: ${theme.colors.primary};
  }
`;

const animations: Record<
  LogVariant,
  ({ theme }: { theme: Theme }) => Keyframes
> = {
  success: flashSuccess,
  bluetooth: flashBluetooth,
  failed: flashFailed,
  unknown: flashFailed,
};

const successfulStyles = ({ theme }: { theme: Theme }) => css``;

const bluetoothStyles = ({ theme }: { theme: Theme }) => css`
  background: linear-gradient(
    145deg,
    ${theme.colors.secondary} 0%,
    ${theme.colors.primary} 25%,
    ${theme.colors.primary} 50%,
    ${theme.colors.secondary} 70%
  );
  background-size: 150% 150%;
`;

const failedStyles = ({ theme }: { theme: Theme }) => css`
  background-color: ${theme.colors.error};

  font-size: 8px;
`;

/**
 * @deprecated
 */
const legacyStyles = ({ theme }: { theme: Theme }) => css`
  background-color: ${theme.colors.gray};
`;

export const Log = styled.div<{ variant: LogVariant; isLegacy?: boolean }>`
  ${logStyles}
  ${({ variant }) => variant === "success" && successfulStyles};
  ${({ variant }) => variant === "success" && flashSuccess};
  ${({ variant }) => variant === "bluetooth" && bluetoothStyles};
  ${({ variant }) => variant === "failed" && failedStyles};
  ${({ variant }) => variant === "unknown" && failedStyles};
  ${({ isLegacy }) => isLegacy && legacyStyles};
  animation: 3s ease 1 forwards
    ${({ variant, isLegacy }) => !isLegacy && animations[variant]};
`;

export const LogName = styled.h1`
  font-size: 2.2em;
  margin: 0;

  text-overflow: ellipsis;
  white-space: nowrap;
  overflow: hidden;
`;

export const TimestampContainer = styled.div<{ variant: LogVariant }>`
  display: flex;
  flex-direction: ${({ variant }) =>
    variant === "failed" || variant === "unknown" ? "row" : "column"};
  justify-content: center;
  align-items: flex-end;
  min-width: 8rem;
  margin-left: 2rem;

  ${({ variant }) => variant === "failed" && "gap: 0.5rem"};
  ${({ variant }) => variant === "failed" && "font-size: 16px"};
  ${({ variant }) => variant === "unknown" && "gap: 0.5rem"};
  ${({ variant }) => variant === "unknown" && "font-size: 16px"};
`;

export const LogTimestamp = styled.p`
  font-size: 1.1em;
  font-weight: inherit;
`;
