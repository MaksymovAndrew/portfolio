import { APP_NAME } from "config/app";

interface HomePageProps {
    params: Promise<{ locale: string }>;
}

const HomePage = async ({ params }: HomePageProps) => {
    const { locale } = await params;

    return (
        <main>
            <h1>{APP_NAME}</h1>
            <p>{locale}</p>
        </main>
    );
};

export default HomePage;
