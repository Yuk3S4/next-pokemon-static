import Document, { Html, Head, Main, NextScript, DocumentContext } from 'next/document'
import { CssBaseline } from "@nextui-org/react";

class MyDocument extends Document {

    // Para que nuestra página se vea bien en todos los navegadores web - tipo normalize

    static async getInitialProps(ctx: DocumentContext) {
        const initialProps = await Document.getInitialProps(ctx)
        return { 
            ...initialProps,
            styles: <>{initialProps.styles}</>,
        }
    }

    render() {
        return (
            <Html lang="es">
                <Head>
                    {CssBaseline.flush()}
                </Head>
                <body>
                    <Main />
                    <NextScript />
                </body>
            </Html>    
        )
    }
}

export default MyDocument