module.exports = {
    code(info){
        return `<div id="mailContentContainer" class="qmbox qm_con_body_content qqmail_webmail_only" style="">
                     <div class="header" style=" margin: 0px 30px; padding: 0px; height: 70px; text-align: center; line-height: 70px; color: white; font-size: 20px; font-weight: bold; background-color: rgb(7, 44, 97); border-top-left-radius: 10px; border-top-right-radius: 10px ; ; ; ; ">
                            Moment
                     </div>
                     <div class="content" style=" margin: 0px 30px; padding: 0px; border-bottom-left-radius: 10px; border-bottom-right-radius: 10px ; ; ; ; ">
                            <h1 style="margin: 0px; padding: 0px; font-size: 16px; text-align: center; color: rgb(51, 51, 51); line-height: 66px; text-align: center; font-weight: 500;">
                                您好，请确认您在Moment的注册邮箱
                            </h1>
                            <hr style="margin: 0px 30px 20px; padding: 0px; border-style: solid; border-color: rgb(153, 153, 153); border-image: initial;">
                            <div class="first" style="margin: 0px 30px 20px; padding: 0px;">
                                <span style="margin: 0px; padding: 0px; color: rgb(51, 51, 51);">
                                    Hi，
                                </span>
                                <span style="margin: 0px; padding: 0px; color: rgb(51, 51, 51);">
                                    ${info.email}
                                </span>
                            </div>
                            <div class="second" style="margin: 0px 30px 20px; padding: 0px;">
                                <span style="margin: 0px; padding: 0px; color: rgb(51, 51, 51); font-weight: bold;">
                                    为了保障您的账号安全，请将下述验证码填写在注册页面完成账号激活
                                </span>
                                <span style="margin: 0px; padding: 0px;">
                                    (请在5分钟内完成)
                                </span>
                            </div>
                            <div class="third" style="margin: 0px 30px 20px; padding: 0px;">
                                <span style="margin: 0px; padding: 0px; color: rgb(51, 51, 51); font-weight: bold;">
                                    您的验证码为：
                                </span>
                                <span class="verify-code" style="margin: 0px; padding: 0px; color: rgb(0, 160, 233); font-weight: bold; font-size: 18px;">
                                    ${info.code}
                                </span>
                                <span style="margin: 0px; padding: 0px; color: rgb(51, 51, 51); font-weight: bold;">
                                    &nbsp;（不区分大小写）
                                </span>
                            </div>
                            <div class="tip" style="margin: 60px 30px 20px; padding: 0px;">
                                <span style="margin: 0px; padding: 0px; color: rgb(102, 102, 102);">
                                    如果您没有在Moment进行注册,请忽略本邮件;
                                </span>
                                <br style="margin: 0px; padding: 0px;">
                                <br style="margin: 0px; padding: 0px;">
                                <span style="margin: 0px; padding: 0px; color: rgb(102, 102, 102);">
                                    激活验证码有效期为5min，超时可重发;
                                </span>
                            </div>
                            <div class="company" style="margin: 40px 30px 20px; padding: 0px;">
                                <span class="companyName" style="margin: 0px 20px 0px 0px; padding: 0px; font-size: 14px; color: rgb(51, 51, 51);">
                                    Moment
                                </span>
                                <span style="margin: 0px; padding: 0px; font-size: 14px; color: rgb(51, 51, 51);">
                                    服务团队
                                </span>
                                <div style="margin: 20px 0px; padding: 0px 0px 20px;">
                                    <span class="stop" style="margin: 0px; padding: 0px; color: rgb(51, 51, 51);">
                                        本邮件由系统自动发送，
                                    </span>
                                    <span class="red" style="margin: 20px 0px; padding: 0px; color: rgb(255, 0, 0);">
                                        请勿直接回复.
                                    </span>
                                </div>
                            </div>
                     </div>
                     <div class="footer" style=" margin: 0px 0px 0px 30px; padding: 0px; text-align: left ; ; ; ; ; ">
                            <img src="http://bazhua.igexin.com/image_mail/iconfont-youjian.png" style="margin: 0px; padding: 0px;">
                            &nbsp;
                            <span style="margin: 0px 25px 0px 0px; padding: 0px; color: rgb(153, 153, 153);">
                                客服邮箱：
                                <a href="mailto:admin@momentin.cn" target="_blank">
                                   admin@momentin.cn
                                </a>
                            </span>
                            <br>
                            <img src="http://bazhua.igexin.com/image_mail/iconfont-dianhua.png" style="margin: 0px; padding: 0px;">
                            &nbsp;
                            <span style="margin: 0px 25px 0px 0px; padding: 0px; color: rgb(153, 153, 153);">
                                客服热线：
                                <span style="border-bottom:1px dashed #ccc;" t="5" times="">
                                13003919397
                                </span>
                            </span>
                            <br>
                            <img src="http://bazhua.igexin.com/image_mail/iconfont-qq.png" style="margin: 0px; padding: 0px;">
                            &nbsp;
                            <span style="margin: 0px 25px 0px 0px; padding: 0px; color: rgb(153, 153, 153);">
                                客服QQ：
                                <span style="border-bottom:1px dashed #ccc;z-index:1" t="7" onclick="return false;" data="651734877">
                                651734877
                                </span>
                            </span>
                            <div style="margin: 0px 0px 24px; padding: 20px 0px;">
                                <span class="link" style="margin: 0px; padding: 0px; color: rgb(0, 160, 233);">
                                    <a href="http://www.momentin.cn/" style="margin: 0px; padding: 0px; text-decoration: none; color: rgb(0, 160, 233);" target="_blank">
                                        Moment官网
                                    </a>
                                </span>
                                <span class="line" style="margin: 0px 20px; padding: 0px; color: rgb(153, 153, 153);">|</span>&nbsp;
                                <span class="link" style="margin: 0px; padding: 0px; color: rgb(0, 160, 233);">
                                    <a href="http://weibo.com/moemnt" style="margin: 0px; padding: 0px; text-decoration: none; color: rgb(0, 160, 233);" target="_blank">
                                    关注微博
                                    </a>
                                </span>
                                <span class="line" style="margin: 0px 20px; padding: 0px; color: rgb(153, 153, 153);">|</span>&nbsp;
                                <span class="link" style="margin: 0px; padding: 0px; color: rgb(0, 160, 233);">关注公众号（MomentIn）</span>
                            </div>
                     </div>
                </div>`
    },
    comment(from, to, content, isReply){
        return `<div id="mailContentContainer" class="qmbox qm_con_body_content qqmail_webmail_only" style="">
                     <div class="header" style=" margin: 0px 30px; padding: 0px; height: 70px; text-align: center; line-height: 70px; color: white; font-size: 20px; font-weight: bold; background-color: rgb(7, 44, 97); border-top-left-radius: 10px; border-top-right-radius: 10px ; ; ; ; ">
                            Moment
                     </div>
                     <div class="content" style=" margin: 0px 30px; padding: 0px; border-bottom-left-radius: 10px; border-bottom-right-radius: 10px ; ; ; ; ">
                            <h1 style="margin: 0px; padding: 0px; font-size: 16px; text-align: center; color: rgb(51, 51, 51); line-height: 66px; text-align: center; font-weight: 500;">
                                您好，你有未读消息哦~
                            </h1>
                            <hr style="margin: 0px 30px 20px; padding: 0px; border-style: solid; border-color: rgb(153, 153, 153); border-image: initial;">
                            <div class="first" style="margin: 0px 30px 20px; padding: 0px;">
                                <span style="margin: 0px; padding: 0px; color: rgb(51, 51, 51);">
                                    Hi，
                                </span>
                                <span style="margin: 0px; padding: 0px; color: rgb(51, 51, 51);">
                                    ${to.author.user_id.username}
                                </span>
                            </div>
                            <div class="second" style="margin: 0px 30px 20px; padding: 0px;">
                                <span style="margin: 0px; padding: 0px; color: rgb(51, 51, 51); font-weight: bold;">
                                    ${isReply ? `${from.username}回复了你的文章 《${to.title}》` : `${from.username}评论了你的文章 《${to.title}》`} 
                                </span>
                            </div>
                            <div class="third" style="margin: 0px 30px 20px; padding: 0px;">
                                <span style="margin: 0px; padding: 0px; color: rgb(51, 51, 51); font-weight: bold;">
                                    ${from.username}： ${content}
                                </span>
                            </div>
                            <div class="company" style="margin: 40px 30px 20px; padding: 0px;">
                                <span class="companyName" style="margin: 0px 20px 0px 0px; padding: 0px; font-size: 14px; color: rgb(51, 51, 51);">
                                    Moment
                                </span>
                                <span style="margin: 0px; padding: 0px; font-size: 14px; color: rgb(51, 51, 51);">
                                    服务团队
                                </span>
                                <div style="margin: 20px 0px; padding: 0px 0px 20px;">
                                    <span class="stop" style="margin: 0px; padding: 0px; color: rgb(51, 51, 51);">
                                        本邮件由系统自动发送，
                                    </span>
                                    <span class="red" style="margin: 20px 0px; padding: 0px; color: rgb(255, 0, 0);">
                                        请勿直接回复.
                                    </span>
                                </div>
                            </div>
                     </div>
                     <div class="footer" style=" margin: 0px 0px 0px 30px; padding: 0px; text-align: left ; ; ; ; ; ">
                            <img src="http://bazhua.igexin.com/image_mail/iconfont-youjian.png" style="margin: 0px; padding: 0px;">
                            &nbsp;
                            <span style="margin: 0px 25px 0px 0px; padding: 0px; color: rgb(153, 153, 153);">
                                客服邮箱：
                                <a href="mailto:admin@momentin.cn" target="_blank">
                                   admin@momentin.cn
                                </a>
                            </span>
                            <br>
                            <img src="http://bazhua.igexin.com/image_mail/iconfont-dianhua.png" style="margin: 0px; padding: 0px;">
                            &nbsp;
                            <span style="margin: 0px 25px 0px 0px; padding: 0px; color: rgb(153, 153, 153);">
                                客服热线：
                                <span style="border-bottom:1px dashed #ccc;" t="5" times="">
                                13003919397
                                </span>
                            </span>
                            <br>
                            <img src="http://bazhua.igexin.com/image_mail/iconfont-qq.png" style="margin: 0px; padding: 0px;">
                            &nbsp;
                            <span style="margin: 0px 25px 0px 0px; padding: 0px; color: rgb(153, 153, 153);">
                                客服QQ：
                                <span style="border-bottom:1px dashed #ccc;z-index:1" t="7" onclick="return false;" data="651734877">
                                651734877
                                </span>
                            </span>
                            <div style="margin: 0px 0px 24px; padding: 20px 0px;">
                                <span class="link" style="margin: 0px; padding: 0px; color: rgb(0, 160, 233);">
                                    <a href="http://www.momentin.cn/" style="margin: 0px; padding: 0px; text-decoration: none; color: rgb(0, 160, 233);" target="_blank">
                                        Moment官网
                                    </a>
                                </span>
                                <span class="line" style="margin: 0px 20px; padding: 0px; color: rgb(153, 153, 153);">|</span>&nbsp;
                                <span class="link" style="margin: 0px; padding: 0px; color: rgb(0, 160, 233);">
                                    <a href="http://weibo.com/moemnt" style="margin: 0px; padding: 0px; text-decoration: none; color: rgb(0, 160, 233);" target="_blank">
                                    关注微博
                                    </a>
                                </span>
                                <span class="line" style="margin: 0px 20px; padding: 0px; color: rgb(153, 153, 153);">|</span>&nbsp;
                                <span class="link" style="margin: 0px; padding: 0px; color: rgb(0, 160, 233);">关注公众号（MomentIn）</span>
                            </div>
                     </div>
                </div>`
    }
}