import { FC, useContext } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

import AlertContext from "../../context/alert/AlertContext";

import { Alert, AlertContext as IAlertContext } from "context";

const Alerts: FC = () => {
  const alertContext: IAlertContext = useContext(AlertContext);
  const { alerts, removeAlert } = alertContext;

  return (
    <div className="container">
      {alerts.length > 0 &&
        alerts.map(({ id, type, msg }: Alert) => (
          <div key={id} className={`alert alert-${type}`}>
            <div>
              {type !== "danger" ? (
                <FontAwesomeIcon icon={["fas", "info-circle"]} />
              ) : (
                <FontAwesomeIcon icon={["fas", "exclamation-circle"]} />
              )}
              &nbsp;{msg}
            </div>
            <button
              style={{
                padding: "0.5rem 1rem",
                margin: "-0.5rem",
                border: "none",
                background: "none",
              }}
              className={`alert-${type} btn`}
              onClick={() => removeAlert(id)}
            >
              <FontAwesomeIcon icon={["fas", "times-circle"]} />
            </button>
          </div>
        ))}
    </div>
  );
};

export default Alerts;
