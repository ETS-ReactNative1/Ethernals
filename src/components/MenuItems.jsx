import { useLocation } from "react-router";
import { Menu } from "antd";
import { NavLink } from "react-router-dom";
import { useMoralis } from "react-moralis";

function MenuItems() {
  const { pathname } = useLocation();
  const { isAuthenticated } = useMoralis();
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
      {isAuthenticated ? (
        <Menu.Item key="/myEvents">
          <NavLink to="/myEvents">My events</NavLink>
        </Menu.Item>
      ) : (
        <></>
      )}
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
