import React, { Component } from 'react';
import styled, {ThemeProvider, injectGlobal} from "styled-components";
import Header from "../components/Header";
import Meta from "../components/Meta";

const theme = {
    red: '#FF0000',
    black: '#393939',
    grey: '#3A3A3A',
    lightgrey: '#E1E1E1',
    offWhite: '#EDEDED',
    maxWidth: '1000px',
    bs: '0 12px 24px 0 rgba(0, 0, 0, 0.09)',
    accentColor: '#FF0000',
    modalDialogIndex: 50
};

const StyledPage = styled.div`
    background: white;
    color: ${props => props.theme.black};
`;

const Inner = styled.div`
    max-width: ${props => props.theme.maxWi};
    margin: 0 auto;
    padding: 2rem;
`;

injectGlobal`
    /* @font-face {
        font-family: 'radnika_next';
        src: url('/static/radnikanext-medium-webfont.woff2')
        format('woff2');
        font-weight: normal;
        font-style: normal;
    } */

    /* lato-300 - latin */
    @font-face {
    font-family: 'Lato';
    font-style: normal;
    font-weight: 300;
    src: url('/static/lato-v15-latin-300.eot'); /* IE9 Compat Modes */
    src: local('Lato Light'), local('Lato-Light'),
        url('/static/lato-v15-latin-300.eot?#iefix') format('embedded-opentype'), /* IE6-IE8 */
        url('/static/lato-v15-latin-300.woff2') format('woff2'), /* Super Modern Browsers */
        url('/static/lato-v15-latin-300.woff') format('woff'), /* Modern Browsers */
        url('/static/lato-v15-latin-300.ttf') format('truetype'), /* Safari, Android, iOS */
        url('/static/lato-v15-latin-300.svg#Lato') format('svg'); /* Legacy iOS */
    }
    /* lato-300italic - latin */
    @font-face {
    font-family: 'Lato';
    font-style: italic;
    font-weight: 300;
    src: url('/static/lato-v15-latin-300italic.eot'); /* IE9 Compat Modes */
    src: local('Lato Light Italic'), local('Lato-LightItalic'),
        url('/static/lato-v15-latin-300italic.eot?#iefix') format('embedded-opentype'), /* IE6-IE8 */
        url('/static/lato-v15-latin-300italic.woff2') format('woff2'), /* Super Modern Browsers */
        url('/static/lato-v15-latin-300italic.woff') format('woff'), /* Modern Browsers */
        url('/static/lato-v15-latin-300italic.ttf') format('truetype'), /* Safari, Android, iOS */
        url('/static/lato-v15-latin-300italic.svg#Lato') format('svg'); /* Legacy iOS */
    }
    /* lato-regular - latin */
    @font-face {
    font-family: 'Lato';
    font-style: normal;
    font-weight: 400;
    src: url('/static/lato-v15-latin-regular.eot'); /* IE9 Compat Modes */
    src: local('Lato Regular'), local('Lato-Regular'),
        url('/static/lato-v15-latin-regular.eot?#iefix') format('embedded-opentype'), /* IE6-IE8 */
        url('/static/lato-v15-latin-regular.woff2') format('woff2'), /* Super Modern Browsers */
        url('/static/lato-v15-latin-regular.woff') format('woff'), /* Modern Browsers */
        url('/static/lato-v15-latin-regular.ttf') format('truetype'), /* Safari, Android, iOS */
        url('/static/lato-v15-latin-regular.svg#Lato') format('svg'); /* Legacy iOS */
    }
    /* lato-italic - latin */
    @font-face {
    font-family: 'Lato';
    font-style: italic;
    font-weight: 400;
    src: url('/static/lato-v15-latin-italic.eot'); /* IE9 Compat Modes */
    src: local('Lato Italic'), local('Lato-Italic'),
        url('/static/lato-v15-latin-italic.eot?#iefix') format('embedded-opentype'), /* IE6-IE8 */
        url('/static/lato-v15-latin-italic.woff2') format('woff2'), /* Super Modern Browsers */
        url('/static/lato-v15-latin-italic.woff') format('woff'), /* Modern Browsers */
        url('/static/lato-v15-latin-italic.ttf') format('truetype'), /* Safari, Android, iOS */
        url('/static/lato-v15-latin-italic.svg#Lato') format('svg'); /* Legacy iOS */
    }
    /* lato-700italic - latin */
    @font-face {
    font-family: 'Lato';
    font-style: italic;
    font-weight: 700;
    src: url('/static/lato-v15-latin-700italic.eot'); /* IE9 Compat Modes */
    src: local('Lato Bold Italic'), local('Lato-BoldItalic'),
        url('/static/lato-v15-latin-700italic.eot?#iefix') format('embedded-opentype'), /* IE6-IE8 */
        url('/static/lato-v15-latin-700italic.woff2') format('woff2'), /* Super Modern Browsers */
        url('/static/lato-v15-latin-700italic.woff') format('woff'), /* Modern Browsers */
        url('/static/lato-v15-latin-700italic.ttf') format('truetype'), /* Safari, Android, iOS */
        url('/static/lato-v15-latin-700italic.svg#Lato') format('svg'); /* Legacy iOS */
    }
    /* lato-900 - latin */
    @font-face {
    font-family: 'Lato';
    font-style: normal;
    font-weight: 900;
    src: url('/static/lato-v15-latin-900.eot'); /* IE9 Compat Modes */
    src: local('Lato Black'), local('Lato-Black'),
        url('/static/lato-v15-latin-900.eot?#iefix') format('embedded-opentype'), /* IE6-IE8 */
        url('/static/lato-v15-latin-900.woff2') format('woff2'), /* Super Modern Browsers */
        url('/static/lato-v15-latin-900.woff') format('woff'), /* Modern Browsers */
        url('/static/lato-v15-latin-900.ttf') format('truetype'), /* Safari, Android, iOS */
        url('/static/lato-v15-latin-900.svg#Lato') format('svg'); /* Legacy iOS */
    }
    html{
        box-sizing: border-box;
        font-size: 10px;
    }
    *, *:before, *:after {
        box-sizing: inherit;
    } 
    body{
        padding: 0;
        margin: 0;
        font-size: 1.5rem;
        line-height: 2;
        font-family: 'radnika_next';
    }
    a {
        text-decoration: none;
        color: ${theme.black};
    }
`

class Page extends Component {
    render() {
        return (
            <ThemeProvider theme={theme}>
                <StyledPage>
                    <Meta/>
                    <Header/>
                    <Inner>{this.props.children}</Inner>
                </StyledPage>
            </ThemeProvider>
        );
    }
}

export default Page;