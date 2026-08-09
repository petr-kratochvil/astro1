import { useTranslation } from "react-i18next";
import { useTitle } from "src/hooks/useTitle";

export default function PageNotFound() {
  const { t } = useTranslation();
  useTitle(t("title.notFound"));
  const style = {
    border: "1px solid silver",
    background: "#fcfcfc",
    padding: "70px 70px",
    margin: "40px auto",
    width: "300px",
    maxWidth: "40vw",
  };
  const headerStyle = {
    padding: "20px 20px",
    margin: "40px auto",
    width: "70px",
  };
  return (
    <>
      <h1 style={headerStyle}>404</h1>
      <div style={style}>{t("notFound.message")}</div>
    </>
  );
}
