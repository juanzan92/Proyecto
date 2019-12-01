import React from "react";

//componentes
import AccountTitle from "../../components/account/AccountTitle";
import VendorUserCard from "../../components/account/VendorUserCard";
import VendorSubscriptionTable from "../../components/account/VendorSubscriptionTable";
import { Auth } from "aws-amplify";
import UserCard from "../../components/account/UserCard";
import SuscriptionTable from "../../components/account/SuscriptionTable";
import wrapper from "../../components/Wrapper";
const Context = React.createContext();

class UserAccount extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      isLoading: true,
      user: "",
      orders: []
    };
    this.getUsuario();
  }

  getUsuario() {
    Auth.currentAuthenticatedUser({}).then(user1 => {
      this.setState({
        user: user1.attributes
      });
    });
  }

  componentDidMount() {}

  componentDidUpdate() {
    const { user } = this.state;

    if (this.state.user != "") {
      const rol = user["custom:role"];
      if (rol === "consumer" && this.state.orders.length === 0) {
        this.fetchOrders();
      } else if (
        this.state.user != "" &&
        rol === "vendor" &&
        this.state.orders.length === 0
      ) {
        this.fetchOportunities();
      }
    }
  }

  fetchOrders() {
    const url = `http://localhost:8080/subscriptions/search?index_name=username&search_pattern=${this.state.user.nickname}`;
    fetch(url)
      .then(response => {
        return response.json();
      })
      .then(myJson => {
        this.setState({
          orders: myJson,
          isLoading: false
        });
      })
      .catch(e => console.log(e));
  }

  fetchOportunities() {
    const url = `http://localhost:8080/catalog/items/search?index_name=vendor_username&search_pattern=${this.state.user.nickname}`;
    fetch(url)
      .then(response => {
        return response.json();
      })
      .then(myJson => {
        this.setState({
          orders: myJson,
          isLoading: false
        });
      })
      .catch(e => console.log(e));
  }

  render() {
    const { user, orders, isLoading } = this.state;
    const selected = "suscripciones";
    if (user && orders && !isLoading) {
      if (user["custom:role"] === "consumer") {
        return (
          <Context.Provider value={selected}>
            <AccountTitle />
            <div className="container padding-bottom-3x mb-2">
              <div className="row">
                <UserCard
                  user={user}
                  orders={orders}
                  selected="suscripciones"
                />
                <SuscriptionTable ordenes={orders} />
              </div>
            </div>
          </Context.Provider>
        );
      } else {
        return (
          <Context.Provider value={selected}>
            <AccountTitle />
            <div className="container padding-bottom-3x mb-2">
              <div className="row">
                <VendorUserCard
                  user={user}
                  orders={orders}
                  selected="oportunities"
                />
                <VendorSubscriptionTable items={orders} />
              </div>
            </div>
          </Context.Provider>
        );
      }
    } else {
      return (
        <div className="spinner-border text-info m-2 center" role="status">
          <span className="sr-only">Loading...</span>
        </div>
      );
    }
  }
}

export const ContextSelected = Context;
export default wrapper(UserAccount);
