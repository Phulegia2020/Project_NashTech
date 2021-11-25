import React, { Component } from 'react';
import {
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
    componentDidMount()
    {
        window.scrollTo(0, 0);
    }
    
    render() {
        return (
            <div>
                <Segment style={{ padding: '5em 0em' }} vertical>
                    <Grid container stackable verticalAlign='middle'>
                        <Grid.Row>
                            <Grid.Column width={8}>
                                <Header as='h3' style={{ fontSize: '2em' }} id="title-about">Giới Thiệu</Header>
                                <p style={{ fontSize: '1.33em', textAlign: 'justify' }}>
                                    THE PLAYSTATION mong muốn trở thành nơi kinh doanh hàng đầu các sản phẩm máy chơi game Playstation. 
                                    Đồng thời phát triển dịch vụ cung cấp và hỗ trợ các bảo hành máy nhằm tạo cho khách hàng có thể thưởng 
                                    thức và trải nghiệm những tinh túy của công nghệ được áp dụng vào máy Playstation tại Việt Nam. Định hướng phát 
                                    triển của công ty là phát triển chuỗi bán lẻ hàng đầu mang thương hiệu Máy PlayStation rộng khắp nhiều tỉnh thành 
                                    trên cả nước, là nơi bán hàng uy tín, đáng tin cậy nhiều đối tác và các đơn vị kinh doanh khác.
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
                    </Grid>
                </Segment>

                <Segment style={{ padding: '0em' }} vertical>
                    <Grid celled='internally' columns='equal' stackable>
                        <Grid.Row textAlign='center'>
                            <Grid.Column style={{ paddingBottom: '3em', paddingTop: '3em' }}>
                                <Header as='h3' style={{ fontSize: '2em' }}>CHI NHÁNH</Header>
                                <div class="col-md-auto">
                                    <div class="p-2 mb-3">
                                        <span class="d-block text-primary h4 text-uppercase">Hà Nội</span>
                                        <p class="mb-0" style={{ fontSize: '1.33em' }}>Km10, Đường Nguyễn Trãi, Q.Hà Đông</p>
                                    </div>
                                    <div class="p-2 mb-3">
                                        <span class="d-block text-danger h4 text-uppercase">Đà Nẵng</span>
                                        <p class="mb-0" style={{ fontSize: '1.33em' }}>75 Nguyễn Khuyến, P. Hoà Minh, Q. Liên Chiểu</p>
                                    </div>
                                    <div class="p-2">
                                        <span class="d-block text-success h4 text-uppercase">Thành phố Hồ Chí Minh</span>
                                        <p class="mb-0" style={{ fontSize: '1.33em' }}>97 Man Thiện, P. Hiệp Phú, Quận 9</p>
                                    </div>
                                </div>
                            </Grid.Column>
                            <Grid.Column style={{ paddingBottom: '3em', paddingTop: '3em' }}>
                                <Header as='h3' style={{ fontSize: '2em' }}>"Sony Entertainment"</Header>
                                <p style={{ fontSize: '1.33em' }}>
                                    <Image avatar src='https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTc9zck2lDQrUmSt0-0Msosqi5r_HhUBeekpQ&usqp=CAU' />
                                    <b>PlayStation</b> Enjoy The Life!
                                </p>
                                <Header as='h3' style={{ fontSize: '2em' }}>PlayStation Is Real</Header>
                                <p style={{ fontSize: '1.33em' }}>
                                    Yes that's right, you thought it was the stuff of dreams, 
                                </p>
                                <p style={{ fontSize: '1.33em' }}>but even bananas can be bioengineered.</p>
                            </Grid.Column>
                        </Grid.Row>
                    </Grid>
                </Segment>

                <Segment  >
                    <Container text>
                        <Header as='h3' style={{ fontSize: '2em', textAlign: 'center' }}>Bản Đồ</Header>
                        <Icon name="map marker alternate" size="large"></Icon>{''}97 Đường Man Thiện, Phường Hiệp Phú, Thành Phố Thủ Đức, Thành phố Hồ Chí Minh
                        
                        <Divider
                            as='h4'
                            className='header'
                            horizontal
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
