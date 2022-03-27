import { Card, Timeline, Typography, Button } from "antd";
import { RightCircleOutlined, PlayCircleOutlined } from '@ant-design/icons';
import React, { useMemo } from "react";
import { useMoralis } from "react-moralis";
import { Row, Col } from 'antd';


import "components/Home.css";

const { Text } = Typography;

export default function QuickStart({ isServerInfo }) {
  return (
    <Row style={{ width: "80%" }}>
      <Col span={18}>
        <h1 id="banner-head">Host and attend live events!</h1>
        <h2 id="tagline">The future of live streaming</h2>
        <Button type="primary" className="home-button" shape="round" icon={<RightCircleOutlined />} size='large'>
          Start Stream
        </Button>
        <Button type="primary" className="home-button" shape="round" icon={<PlayCircleOutlined />} size='large'>
          View Stream
        </Button>
      </Col>
      <Col span={6}>banner image</Col>
    </Row>
  );
}
