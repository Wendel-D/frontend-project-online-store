import React, { Component } from 'react';
import { Link } from 'react-router-dom/cjs/react-router-dom.min';
import Count from '../components/Count';
import ListProdutos from '../components/ListProdutos';
import { getCategories, getProductsFromCategoryAndQuery,
  setLocalItems } from '../services/api';

export default class Home extends Component {
  constructor() {
    super();
    this.state = {
      categoriesList: [],
      textBusca: '',
      listProdutos: [],
      pesquisou: false,
      localState: [],
      itensCartQT: 0,
    };
  }

  componentDidMount() {
    this.fetchCategories();
    const local = JSON.parse(localStorage.getItem('cartItems')) || [];
    this.setState({
      localState: local,
    });
    this.getLocalStorage();
  }

  getLocalStorage = () => {
    const local = JSON.parse(localStorage.getItem('cartItems')) || [];
    const QTLocal = local.reduce((acc, curr) => {
      acc += curr.quantidade;
      return acc;
    }, 0);
    this.setState({
      itensCartQT: QTLocal,
    });
  };

  fetchCategories = async () => {
    const data = await getCategories();
    this.setState({ categoriesList: data });
  };

  handleChange = ({ target }) => {
    const { value, name } = target;

    this.setState({
      [name]: value,
    });
  };

  handleClick = async () => {
    const { textBusca } = this.state;
    const produtos = await getProductsFromCategoryAndQuery(null, textBusca);

    this.setState({
      listProdutos: produtos.results,
      pesquisou: true,
    });
  };

  categoryClick = async (event) => {
    const produtos = await getProductsFromCategoryAndQuery(event.target.name, null);
    this.setState({
      listProdutos: produtos.results,
      pesquisou: true,
    });
  };

  handleCart = async (id) => {
    const { listProdutos, localState } = this.state;
    const produto = listProdutos.find((elem) => elem.id === id);
    const existe = localState.some((e) => e.id === produto.id);
    if (existe) {
      produto.quantidade += 1;
      const existente = localState.findIndex((e) => e.id === produto.id);
      localState.splice(existente, 1);
      localState.push(produto);
      setLocalItems(localState);
    } else {
      produto.quantidade = Number(1);
      localState.push(produto);
      setLocalItems(localState);
    }
    this.getLocalStorage();
  };

  render() {
    const { categoriesList,
      textBusca, listProdutos, pesquisou, itensCartQT } = this.state;
    return (
      <main className="container-home">
        <header className="color-header">
          <nav className="navbar navbar-light">
            <div className="form-inline search-bar">
              <input
                className="form-control mr-sm-1"
                type="text"
                name="textBusca"
                value={ textBusca }
                onChange={ this.handleChange }
                data-testid="query-input"
              />
              <button
                className="btn btn-outline-success my-2 my-sm-0"
                type="button"
                data-testid="query-button"
                onClick={ this.handleClick }
              >
                Pesquisar
              </button>
            </div>
            <Link
              to="/ShopCart"
              data-testid="shopping-cart-button"
              className="btn btn-primary stretched-link btn-size"
            >
              <Count itensCartQT={ itensCartQT } />
              <i className="icon-size bi bi-cart" />
            </Link>
          </nav>
        </header>
        <div className="d-flex color-products">
          <div
            className="sidebar d-flex
        flex-column flex-shrink-0 p-3 text-white color-header"
          >
            <ul className="nav nav-pills flex-column mb-auto">
              {
                categoriesList.map((elem) => (
                  <li key={ elem.id }>
                    <button
                      className="btn-width btn btn-outline-dark"
                      data-testid="category"
                      type="button"
                      name={ elem.id }
                      onClick={ this.categoryClick }
                    >
                      { elem.name }
                    </button>
                  </li>
                ))
              }
            </ul>
          </div>
          <div className="d-flex align-content-stretch flex-wrap">
            <div className="teste">
              {
                listProdutos.length === 0 && (
                  <h3
                    data-testid="home-initial-message"
                  >
                    Digite algum termo de pesquisa ou escolha uma categoria.

                  </h3>)
              }
            </div>
            <ListProdutos
              pesquisou={ pesquisou }
              listProdutos={ listProdutos }
              handleCart={ this.handleCart }
            />
          </div>
        </div>
      </main>
    );
  }
}
