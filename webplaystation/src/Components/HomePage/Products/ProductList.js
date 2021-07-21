import React, {Component} from 'react';
import PropTypes from 'prop-types';
import { Grid } from 'semantic-ui-react'
import ProductItem from './ProductItem';

class ProductList extends Component {
    constructor(props) {
        super(props)
          this.state = {
            products: []
          }
    }

    render() {
        
        return (
            <Grid columns={4}>
                {
                    this.props.products.map((p) =>
                        <Grid.Column key={p.id}>
                            <ProductItem product={p} />
                        </Grid.Column>
                    )
                }
            </Grid>
        );
    }
}

ProductList.propTypes = {
    products: PropTypes.array.isRequired,
}

export default ProductList;
