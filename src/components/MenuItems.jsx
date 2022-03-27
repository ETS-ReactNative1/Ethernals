import { useLocation } from "react-router";
import { Menu } from "antd";
import { NavLink } from "react-router-dom";

function MenuItems() {
  const { pathname } = useLocation();

  return (
    <Menu
      theme="light"
      mode="horizontal"
      style={{
        display: "flex",
        fontSize: "17px",
        fontWeight: "500",
        width: "100%",
        justifyContent: "center",
      }}
      defaultSelectedKeys={[pathname]}
    >
      <Menu.Item key="/quickstart">
        <NavLink to="/quickstart">Home</NavLink>
      </Menu.Item>
      <Menu.Item key="/stream">
        <NavLink to="/stream"> Stream</NavLink>
      </Menu.Item>
      <Menu.Item key="/watchStream">
        <NavLink to="/watchStream"> Watch Stream</NavLink>
      </Menu.Item>
    </Menu>
  );
}

export default MenuItems;
