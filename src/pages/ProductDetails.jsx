import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';
import Count from '../components/Count';
import { getProduct, setLocalItems } from '../services/api';
import FormProductDetail from '../components/FormProductDetail';

export default class ProductDetails extends Component {
  state = {
    productId: [],
    carrinho: [],
    itensCartQT: 0,
    reviews: [],
    emails: '',
    comentarios: '',
    stars: '',
    localAva: [],
    isInvalid: false,
  };

  componentDidMount() {
    this.getLocalAva();
    const inicio = async () => {
      await this.getProducts();
    };
    inicio();

    const produtos = JSON.parse(localStorage.getItem('cartItems')) || [];
    this.setState({
      carrinho: produtos,
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

  getProducts = async () => {
    const { match: { params: { id } } } = this.props;
    const product = await getProduct(id);
    product.quantidade = Number(1);
    product.avaliacao = [];
    this.setState({
      productId: [product],
    });
  };

  sendCart = (objP) => {
    const { carrinho } = this.state;
    const existe = carrinho.some((e) => e.id === objP.id);
    if (existe) {
      objP.quantidade += 1;
      const existente = carrinho.findIndex((e) => e.id === objP.id);
      carrinho.splice(existente, 1);
      carrinho.push(objP);
      setLocalItems(carrinho);
    } else {
      objP.quantidade = Number(1);
      carrinho.push(objP);
      setLocalItems(carrinho);
    }
    this.getLocalStorage();
  };

  handleChange = ({ target }) => {
    const { value, name } = target;

    this.setState({
      [name]: value,
    });
  };

  submitReview = () => {
    const { emails, comentarios, stars } = this.state;
    const objAvaliar = { emails, comentarios, stars };
    if (emails && stars) {
      this.setState((state) => ({
        reviews: [...state.reviews, objAvaliar],
        isInvalid: false,
        emails: '',
        comentarios: '',
        stars: '',
      }), this.saveAvaliation);
    } else {
      this.setState({ isInvalid: true });
    }
  };

  getLocalAva = () => {
    const { match: { params: { id } } } = this.props;
    const getItems = JSON.parse(localStorage.getItem(`${id}`)) || [];
    this.setState({
      localAva: getItems,
    });
  };

  saveAvaliation = () => {
    const { reviews, localAva } = this.state;
    const { match: { params: { id } } } = this.props;

    localStorage.setItem(`${id}`, JSON.stringify([...reviews, ...localAva]));
    this.getLocalAva();
  };

  render() {
    const { isInvalid,
      productId, emails, comentarios, stars, itensCartQT, localAva } = this.state;
    return (
      <div>
        <div>
          <p>
            <Link to="/ShopCart" data-testid="shopping-cart-button">
              Carrinho de compras
            </Link>
          </p>
          <Count itensCartQT={ itensCartQT } />
        </div>
        <div>
          {productId.length > 0 && (productId.map((e) => (
            <div key={ e.id }>
              <div>
                <img
                  data-testid="product-detail-image"
                  src={ e.thumbnail }
                  alt={ e.title }
                />
              </div>
              <div>
                <p data-testid="product-detail-name">{e.title}</p>
                <p data-testid="product-detail-price">{`Price: ${e.price}`}</p>
              </div>
              <button
                type="button"
                onClick={ () => this.sendCart(e) }
                data-testid="product-detail-add-to-cart"
              >
                add carrinho
              </button>
            </div>
          )))}
        </div>
        <div>
          <FormProductDetail
            emails={ emails }
            comentarios={ comentarios }
            stars={ stars }
            handleChange={ this.handleChange }
            submitReview={ this.submitReview }
            isInvalid={ isInvalid }
          />
        </div>
        <div>
          {
            localAva.map((e, i) => (
              <div key={ i }>
                <p data-testid="review-card-email">{e.emails}</p>
                <p data-testid="review-card-rating">{e.comentarios}</p>
                <p data-testid="review-card-evaluation">{e.stars}</p>
              </div>
            ))
          }
        </div>
      </div>
    );
  }
}

ProductDetails.propTypes = {
  match: PropTypes.shape({
    params: PropTypes.shape({
      id: PropTypes.string,
    }),
  }),
}.isRequired;
