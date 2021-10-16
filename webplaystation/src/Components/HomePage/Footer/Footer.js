import React, {Component} from 'react';
import {
    Container,
    Grid,
    Header,
    List,
    Segment,
    Icon
} from 'semantic-ui-react';
import "../../Product/Product.css";

class Footer extends Component {
    render() {
        return(
            <div id='footer-client'>
            <Segment inverted vertical style={{ padding: '5em 0em' }}>
                <Container>
                    <Grid divided inverted stackable style={{ height: '100px' }}>
                        <Grid.Row>
                            <Grid.Column width={3}>
                                <Header inverted as='h4' content='About' />
                                <List link inverted>
                                    <List.Item as='a' className="txtdeco">Sitemap</List.Item>
                                    <List.Item as='a' className="txtdeco">Project</List.Item>
                                    <List.Item as='a' className="txtdeco">Religious Ceremonies</List.Item>
                                    <List.Item as='a' className="txtdeco">Gazebo Plans</List.Item>
                                </List>
                            </Grid.Column>
                            <Grid.Column width={3}>
                                <Header inverted as='h4' content='Services' />
                                <List link inverted >
                                    <List.Item as='a' className="txtdeco">Pre-Order</List.Item>
                                    <List.Item as='a' className="txtdeco">DNA FAQ</List.Item>
                                    <List.Item as='a' className="txtdeco">How To Access</List.Item>
                                    <List.Item as='a' className="txtdeco">Favorite X-Men</List.Item>
                                </List>
                            </Grid.Column>
                            <Grid.Column width={4}>
                                <Header inverted as='h4' content='Contact' />
                                <List link inverted>
                                    <List.Item as='a' className="txtdeco"><Icon name="home" size="large"></Icon> Ho Chi Minh City</List.Item>
                                    <List.Item as='a' className="txtdeco"><Icon name="phone volume" size="large"></Icon>HOTLINE: (028) 38.295.258</List.Item>
                                    <List.Item as='a' className="txtdeco"><Icon name="mail" size="large"></Icon> ps4gamemachine@gmail.com</List.Item>
                                </List>
                            </Grid.Column>
                            <Grid.Column width={5}>
                                <Header as='h4' inverted>Extension</Header>
                                <p>Extra space for a call to action inside the footer that could help re-engage users.</p>
                                <Icon name="facebook" size="large"></Icon>{''}
                                <Icon name="twitter" size="large"></Icon>{''}
                                <Icon name="instagram" size="large"></Icon>
                            </Grid.Column>
                        </Grid.Row>
                    </Grid>
                </Container>
            </Segment>
            </div>
        );
    }
}

export default Footer;