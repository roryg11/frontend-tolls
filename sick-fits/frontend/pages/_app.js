import App, { Container } from "next/app";
import Page from "../components/Page";
import { ApolloProvider } from "react-apollo";
import {IntlProvider} from "react-intl";
import withData from "../lib/withData";

class MyApp extends App {
    // this is a nextjs lifecycle method that runs before 1st render,
    static async getInitialProps({Component, ctx}){
        let pageProps = {};
        // every single page that we have will crawl for queries or mutations in that page
        // queries need to be fired and returned before we can render the page
        // for server side rendering
        if(Component.getInitialProps){
            pageProps = await Component.getInitialProps(ctx);
        }
        // this exposes the query to the user/client and wil
        pageProps.query = ctx.query;
        return { pageProps };
    }
    render(){
        const { Component, apollo, pageProps } = this.props;
        return(
            <IntlProvider locale="en">
                <Container>
                    <ApolloProvider client={apollo}>
                        <Page>
                            <Component {...pageProps}/>
                        </Page>
                    </ApolloProvider>
                </Container>
            </IntlProvider> 
        )
    }
}

export default withData(MyApp);