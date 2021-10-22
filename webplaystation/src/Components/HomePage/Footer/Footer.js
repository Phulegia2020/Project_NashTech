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
                                <Header inverted as='h4' content='Thông Tin' />
                                <List link inverted>
                                    <List.Item as='a' className="txtdeco">Quy định thanh toán</List.Item>
                                    <List.Item as='a' className="txtdeco">Dự án</List.Item>
                                    <List.Item as='a' className="txtdeco">Chính sách vận chuyển</List.Item>
                                    <List.Item as='a' className="txtdeco">Chính sách đổi / trả hàng</List.Item>
                                </List>
                            </Grid.Column>
                            <Grid.Column width={3}>
                                <Header inverted as='h4' content='Dịch Vụ' />
                                <List link inverted >
                                    <List.Item as='a' className="txtdeco">Giao hàng</List.Item>
                                    <List.Item as='a' className="txtdeco">Trung tâm hỗ trợ</List.Item>
                                    <List.Item as='a' className="txtdeco">Điều khoản chung</List.Item>
                                    <List.Item as='a' className="txtdeco">Hướng dẫn mua hàng</List.Item>
                                </List>
                            </Grid.Column>
                            <Grid.Column width={4}>
                                <Header inverted as='h4' content='Liên Hệ' />
                                <List link inverted>
                                    <List.Item as='a' className="txtdeco"><Icon name="home" size="large"></Icon> Thành phố Hồ Chí Minh</List.Item>
                                    <List.Item as='a' className="txtdeco"><Icon name="phone volume" size="large"></Icon>HOTLINE: (028) 38.295.258</List.Item>
                                    <List.Item as='a' className="txtdeco"><Icon name="mail" size="large"></Icon> ps4gamemachine@gmail.com</List.Item>
                                </List>
                            </Grid.Column>
                            <Grid.Column width={5}>
                                <Header as='h4' inverted>Mở rộng</Header>
                                <p>Chuyên kinh doanh PS4, PS5... Chúng tôi sẽ cố gắng mang đến những sản phẩm, dịch vụ chất lượng với giá thành phù hợp với mọi game thủ.</p>
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