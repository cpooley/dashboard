import React, { useEffect, useState } from "react";
import { Container, Row, Col, Card } from "react-bootstrap";
import LogLevelSummaryChart from "../components/LogStream/LogLevelSummaryChart";
import LogLevelPieChart from "../components/LogStream/LogLevelPieChart";
import { PageTitle } from "../components/Common/PageTitle";
import { LogsTable } from "../components/LogStream/LogsTable";
import { Chart } from "../components/Common/Chart/Chart";
import { Store, Dispatcher, Constants } from "../flux";
import { groupBy, objectToChartData } from "../flux/tranformLog";
import useDimensions from "react-cool-dimensions";
import { ResizeObserver } from "@juggle/resize-observer";

const showLogDetails = (log) => {
  Dispatcher.dispatch({
    actionType: Constants.SHOW_MODAL,
    payload: { modal: "logDetails", modalParams: { log } },
  });
};

function LogsView() {
  const { ref, width } = useDimensions({
    useBorderBoxSize: true, // Tell the hook to measure based on the border-box size, default is false
    polyfill: ResizeObserver, // Use polyfill to make this feature works on more browsers
  });
  const [logs, setLogs] = useState([]);
  function getData() {
    const newLogs = Store.getLogs();
    setLogs([...newLogs]);
  }
  useEffect(() => {
    Store.on("update-logs", getData);
    return () => Store.removeListener("update-logs", getData);
  }, []);
  return (
    <Container fluid className="main-content-container px-4">
      <Row noGutters className="page-header py-4">
        <PageTitle
          title="Log Stream"
          subtitle="Network"
          className="text-sm-left mb-3"
        />
      </Row>
      <Row>
        <Col md="10" className="mb-4">
          <LogLevelSummaryChart />
        </Col>
        <Col md="2" className="mb-4">
          <LogLevelPieChart />
        </Col>
      </Row>
      <Row>
        <Col className="mb-4">
          <LogsTable data={logs} showLogDetails={showLogDetails} />
        </Col>
      </Row>
      <Row>
        <Col className="mb-4">
          <Card ref={ref} style={{ width: "100%", height: "100%" }}>
            <Chart
              data={objectToChartData(groupBy(logs, "name")).map((datum) => ({
                ...datum,
                value: datum.value.length,
              }))}
              height={800}
              width={width}
            />
          </Card>
        </Col>
      </Row>
    </Container>
  );
}

export { LogsView };
