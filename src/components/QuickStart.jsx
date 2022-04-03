import { Card, Timeline, Typography, Button } from "antd";
import { RightCircleOutlined, PlayCircleOutlined } from "@ant-design/icons";
import React, { useMemo } from "react";
import { useMoralis } from "react-moralis";
import { Row, Col } from "antd";
import globe from "../assets/globe.png";
import logoLight from "../assets/Logo-light.png";
import { Link, NavLink } from "react-router-dom";
import "components/Home.css";

const { Text } = Typography;

export default function QuickStart({ isServerInfo }) {
  return (
    <Row style={{ width: "90%" }}>
      <Col span={14}>
        <h1 id="banner-head">
          Host and attend <br /> live events!
        </h1>
        <h2 id="tagline">The future of live streaming</h2>
        <NavLink to="/stream">
          <Button
            type="primary"
            className="home-button"
            id="home-button-1"
            shape="round"
            icon={<RightCircleOutlined />}
            size="large"
          >
            Start Stream
          </Button>
        </NavLink>
        <Link to="/watchStream">
          <Button
            type="primary"
            className="home-button"
            id="home-button-2"
            shape="round"
            icon={<PlayCircleOutlined />}
            size="large"
          >
            View Stream
          </Button>
        </Link>
      </Col>
      <Col span={10}>
        <img id="banner_image" src={globe} />
      </Col>
    </Row>
  );
}
