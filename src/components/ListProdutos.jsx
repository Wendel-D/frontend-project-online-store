import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';

export default class ListProdutos extends Component {
  render() {
    const { listProdutos, pesquisou, handleCart } = this.props;
    return (
      <div className="row row-cols-1 row-cols-md-3 g-4">
        {
          pesquisou && listProdutos.length === 0
            ? <p>Nenhum produto foi encontrado</p>
            : (
              listProdutos.map((e) => (
                <div className="col" data-testid="product" key={ e.id }>
                  <div className="card card-width card-height">
                    <img className="card-img-top" src={ e.thumbnail } alt={ e.title } />
                    <p>{e.title}</p>
                    <p>{`Valor: ${e.price}`}</p>
                    {
                      e.shipping.free_shipping
                        && <p data-testid="free-shipping">Frete grátis</p>
                    }
                  </div>

                  <div className="card-body bg-card-body card-width card-body-heigth">
                    <button
                      name={ e.id }
                      type="button"
                      data-testid="product-add-to-cart"
                      onClick={ () => handleCart(e.id) }
                    >
                      Comprar
                    </button>
                    <Link
                      data-testid="product-detail-link"
                      to={ `/productdetails/${e.id}` }
                    >
                      Detalhes

                    </Link>
                  </div>
                </div>
              ))
            )
        }
      </div>
    );
  }
}

ListProdutos.propTypes = {
  listProdutos: PropTypes.shape(),
  pesquisou: PropTypes.bool,
  handleCart: PropTypes.func,
}.isRequired;
