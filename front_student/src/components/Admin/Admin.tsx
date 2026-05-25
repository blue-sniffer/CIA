import React, { Fragment, Dispatch, useEffect } from "react";
import { useDispatch } from "react-redux";
import LeftMenu from "../LeftMenu/LeftMenu";
import TopMenu from "../TopMenu/TopMenu";
import { Switch } from "react-router";
import Users from "../Users/Users";
import Home from "../Home/Home";
import Products from "../Products/Products";
import Orders from "../Orders/Orders";
import Notifications from "../../common/components/Notification";
import { PrivateRoute } from "../../common/components/PrivateRoute";
import { getProducts } from "../../store/actions/products.action";
import { getOrders } from "../../store/actions/orders.actions";

const Admin: React.FC = () => {
  const dispatch: Dispatch<any> = useDispatch();

  useEffect(() => {
    dispatch(getProducts());
    dispatch(getOrders());
  }, [dispatch]);

  return (
    <Fragment>
      <Notifications />
      <LeftMenu />
      <div id="content-wrapper" className="d-flex flex-column">
        <div id="content">
          <TopMenu />
          <div className="container-fluid">
            <Switch>
              <PrivateRoute exact path="/users"><Users /></PrivateRoute>
              <PrivateRoute exact path="/products"><Products /></PrivateRoute>
              <PrivateRoute exact path="/orders"><Orders /></PrivateRoute>
              <PrivateRoute exact path="/"><Home /></PrivateRoute>
            </Switch>
          </div>
        </div>
      </div>
    </Fragment>
  );
};

export default Admin;
