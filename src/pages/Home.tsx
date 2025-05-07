import Header from "../components/Header";

export default function Home() {
  return (
    <>
      <Header />
      <main className="pt-20">
        <section className="h-screen bg-gradient-to-r from-blue-100 to-blue-50 flex items-center justify-center">
          <h1 className="text-4xl font-bold">내 권리를 지켜주는 AI 법률 상담</h1>
        </section>
        <section className="h-screen flex items-center justify-center">
          <p className="text-lg max-w-2xl text-center">
            해고, 임금 체불, 산업재해 등... 어려운 문제를 쉽고 빠르게 상담받으세요.
          </p>
        </section>
      </main>
    </>
  );
}