import Header from "../../components/Header";
import AuthGuard from "../../hocs/AuthGuard";

const Chart: React.FC = () => {
  return (
    <AuthGuard>
      <Header />
    </AuthGuard>
  );
};

export default Chart;
