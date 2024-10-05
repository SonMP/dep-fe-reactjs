import React, { Component } from 'react';
import { connect } from "react-redux";
import { LANGUAGES } from '../../../utils';

class Comment extends Component {
    constructor(props) {
        super(props);
        this.state = {};
    }

    async componentDidMount() {
        this.initFacebookSDK();
    }

    async componentDidUpdate(prevProps) {
        if (this.props.language !== prevProps.language) {
            this.removeFacebookSDK();
            this.initFacebookSDK();
        }
    }

    removeFacebookSDK() {
        // Xóa script của Facebook SDK để có thể tải lại
        const fbScript = document.getElementById('facebook-jssdk');
        if (fbScript) {
            fbScript.parentNode.removeChild(fbScript);
        }
    }

    initFacebookSDK() {
        let language = this.props.language;
        let locale = language === LANGUAGES.VI ? 'vi_VN' : 'en_US';

        // Tạo URL cho SDK Facebook
        const sdkUrl = `https://connect.facebook.net/${locale}/sdk.js#xfbml=1&version=v21.0`;

        // Thêm thẻ fb-root vào DOM nếu chưa có
        if (!document.getElementById('fb-root')) {
            const fbRoot = document.createElement('div');
            fbRoot.id = 'fb-root';
            document.body.appendChild(fbRoot);
        }

        // Kiểm tra xem SDK đã được tải hay chưa
        if (!window.FB) {
            (function (d, s, id) {
                var js, fjs = d.getElementsByTagName(s)[0];
                if (d.getElementById(id)) return;
                js = d.createElement(s); js.id = id;
                js.src = sdkUrl; // Gán giá trị URL đã kiểm tra
                fjs.parentNode.insertBefore(js, fjs);
                js.onload = () => {
                    window.FB.init({
                        appId: 'YOUR_APP_ID', // Thay YOUR_APP_ID bằng app ID của bạn
                        xfbml: true,
                        version: 'v21.0'
                    });
                };
            }(document, 'script', 'facebook-jssdk'));
        } else {
            window.FB.XFBML.parse(); // Khởi tạo lại nếu đã có
        }
    }

    render() {
        let { width, dataHref, numPost } = this.props;
        return (
            <>
                <div id="fb-root"></div>
                <div className='comment-plugin'>
                    <div className="fb-comments"
                        data-href={dataHref}
                        data-width={width ? width : ''}
                        data-numposts={numPost ? numPost : '5'}>
                    </div>
                </div>
            </>
        );
    }
}

const mapStateToProps = state => {
    return {
        language: state.app.language
    };
};

export default connect(mapStateToProps)(Comment);
