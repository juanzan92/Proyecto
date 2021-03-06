import React from "react";
import VendorUserCard from "../../components/account/VendorUserCard";
import wrapper from "../../components/Wrapper";
import VendorAccountProfileForm from "../../components/account/VendorAccountForm";
import AccountTitle from "../../components/account/AccountTitle";
import { Auth } from "aws-amplify";
import { Snackbar } from "@material-ui/core";

class VendorAccountProfile extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      user: "",
      orders: [],
      searchedItems: false,
      isLoading: true
    };
    this.getUsuario();
  }

  getUsuario() {
    Auth.currentAuthenticatedUser({}).then(userObject => {
      this.setState({
        user: userObject.attributes
      });
    });
  }

  componentDidUpdate() {
    if (
      this.state.user !== "" &&
      this.state.orders.length === 0 &&
      !this.state.searchedItems
    ) {
      this.fetchOrders();
    }
  }

  fetchOrders() {
    this.setState({ searchedItems: true });
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
    const { isLoading } = this.state;
    if (!isLoading) {
      return (
        <>
          <AccountTitle />
          <div className="container padding-bottom-3x mb-2">
            <div className="row">
              <VendorUserCard
                user={this.state.user}
                orders={this.state.orders}
                selected={"mi_cuenta"}
              />
              {this.state.user && (
                <VendorAccountProfileForm user={this.state.user} />
              )}
            </div>
          </div>
          <Snackbar />
        </>
      );
    } else {
      return (
        <div className="spinner-center text-info m-2 center" role="status">
          <span className="sr-only">Loading...</span>
        </div>
      );
    }
  }
}

export default wrapper(VendorAccountProfile);
