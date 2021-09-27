import React, { Component } from 'react';
import {
    Button,
    Container,
    Divider,
    Grid,
    Header,
    Image,
    Segment,
    Icon
} from 'semantic-ui-react';
import './About.css';

export default class About extends Component {
    render() {
        return (
            <div>
                <Segment style={{ padding: '8em 0em' }} vertical>
                    <Grid container stackable verticalAlign='middle'>
                        <Grid.Row>
                            <Grid.Column width={8}>
                                <Header as='h3' style={{ fontSize: '2em' }}>About</Header>
                                <p style={{ fontSize: '1.33em' }}>
                                    We can give your company superpowers to do things that they never thought possible. Let us delight
                                    your customers and empower your needs... through pure data analytics.
                                </p>
                                <Header as='h3' style={{ fontSize: '2em' }}>PlayStation Is Real</Header>
                                <p style={{ fontSize: '1.33em' }}>
                                    Yes that's right, you thought it was the stuff of dreams, but even bananas can be bioengineered.
                                </p>
                            </Grid.Column>
                            <Grid.Column floated='right' width={6}>
                                <Image
                                    bordered
                                    size='large'
                                    src='https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQSVR3FyjIu8xz4pf0Qsu743dvskdWXW3ISjg&usqp=CAU'
                                />
                            </Grid.Column>
                        </Grid.Row>
                        <Grid.Row>
                            <Grid.Column textAlign='center'>
                                <Button size='huge'>Check Them Out</Button>
                            </Grid.Column>
                        </Grid.Row>
                    </Grid>
                </Segment>

                <Segment style={{ padding: '0em' }} vertical>
                    <Grid celled='internally' columns='equal' stackable>
                        <Grid.Row textAlign='center'>
                            <Grid.Column style={{ paddingBottom: '5em', paddingTop: '5em' }}>
                                <Header as='h3' style={{ fontSize: '2em' }}>"What a Company"</Header>
                                <p style={{ fontSize: '1.33em' }}>That is what they all say about us</p>
                            </Grid.Column>
                            <Grid.Column style={{ paddingBottom: '5em', paddingTop: '5em' }}>
                                <Header as='h3' style={{ fontSize: '2em' }}>"Sony Entertainment"</Header>
                                <p style={{ fontSize: '1.33em' }}>
                                    <Image avatar src='https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTc9zck2lDQrUmSt0-0Msosqi5r_HhUBeekpQ&usqp=CAU' />
                                    <b>PlayStation</b> Enjoy The Life!
                                </p>
                            </Grid.Column>
                        </Grid.Row>
                    </Grid>
                </Segment>

                <Segment  >
                {/* style={{ padding: '8em 0em' }} vertical*/}
                    <Container text>
                    {/*  */}
                        {/* <Header as='h3' style={{ fontSize: '2em' }}>Breaking The Grid, Grabs Your Attention</Header>
                        <p style={{ fontSize: '1.33em' }}>
                            Instead of focusing on content creation and hard work, we have learned how to master the art of doing
                            nothing by providing massive amounts of whitespace and generic content that can seem massive, monolithic
                            and worth your attention.
                        </p>
                        <Button as='a' size='large'>Read More</Button> */}
                        
                        <Header as='h3' style={{ fontSize: '2em', textAlign: 'center' }}>Bản Đồ</Header>
                        <Icon name="map marker alternate" size="large"></Icon>{''}97 Đường Man Thiện, Phường Hiệp Phú, Thành Phố Thủ Đức, Thành phố Hồ Chí Minh
                        
                        <Divider
                            as='h4'
                            className='header'
                            horizontal
                            // style={{ margin: '3em 0em', textTransform: 'uppercase' }}
                        >
                        </Divider>
                    </Container>
                    <div className='mapBox'>
                        <iframe src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d1164.984398638804!2d106.78690864904158!3d10.847630116750052!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x31752772b245dff1%3A0xb838977f3d419d!2zSOG7jWMgdmnhu4duIEPDtG5nIG5naOG7hyBCxrB1IGNow61uaCBWaeG7hW4gdGjDtG5nIEPGoSBT4bufIFThuqFpIFRQLiBI4buTIENow60gTWluaMK3!5e0!3m2!1svi!2s!4v1632557034207!5m2!1svi!2s"
                        allowFullScreen="" loading="lazy"></iframe>
                    </div>
                </Segment>
            </div>
        )
    }
}
