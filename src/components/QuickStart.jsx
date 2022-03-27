import { Card, Timeline, Typography } from "antd";
import React, { useMemo } from "react";
import { useMoralis } from "react-moralis";
import { Row, Col } from 'antd';


import "components/Home.css";

const { Text } = Typography;

export default function QuickStart({ isServerInfo }) {
  return (
    <Row style={{width:"80%"}}>
      <Col span={12}>
      <h1>Host and attend live events!</h1>
      </Col>
      <Col span={12}>banner image</Col>
    </Row>
  );
}
