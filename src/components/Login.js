// src/components/Login.js
import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import styled from "styled-components";

const LoginContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100vh;
  background-color: #f0f4f8;
  padding: 20px;
`;

const Logo = styled.img`
  width: 250px;
  height: auto;
  margin-bottom: 30px;
`;

const WelcomeText = styled.h2`
  font-size: 1.5em;
  text-align: center;
  color: #333;
  margin-bottom: 20px;
`;

const LoginButton = styled.button`
  background-color: #007bff;
  color: #ffffff;
  font-size: 1em;
  padding: 15px 30px;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  transition: background-color 0.3s ease;

  &:hover {
    background-color: #0056b3;
  }
`;

const FooterText = styled.p`
  margin-top: 30px;
  font-size: 0.9em;
  color: #777;
`;

const Login = () => {
  const navigate = useNavigate();

  useEffect(() => {
    // Inicializar o Pi SDK ao carregar o componente
    if (window.Pi) {
      window.Pi.init({
        version: "2.0", // Versão atual do SDK
        sandbox: true, // Utilize true para ambiente de teste
      });
    } else {
      console.error("Pi SDK não foi carregado corretamente.");
    }

    // Adicionar listener de mensagens para depuração
    window.addEventListener("message", (event) => {
      console.log("Mensagem recebida:", event);
    });

    // Remover listener ao desmontar o componente
    return () => {
      window.removeEventListener("message", (event) => {
        console.log("Mensagem recebida:", event);
      });
    };
  }, []);

  const handleLogin = () => {
    if (window.Pi) {
      window.Pi.authenticate(
        ["username"], // Certifique-se de que isso é um array de strings de permissões
        {
          onReadyForServerApproval: function (uuid) {
            console.log("UUID para aprovação no servidor:", uuid);
          },
          onReadyForServerCompletion: function (data) {
            console.log("Autenticação completada:", data);
            navigate("/home");
          },
          onIncompletePaymentFound: function (payment) {
            console.log("Pagamento incompleto encontrado:", payment);
          },
          onCancel: function () {
            console.log("Login cancelado pelo usuário");
          },
          onError: function (error) {
            console.error("Erro durante a autenticação:", error);
          },
        }
      );
    } else {
      console.error("Pi SDK não foi carregado corretamente.");
    }
  };

  return (
    <LoginContainer>
      <Logo src={`${process.env.PUBLIC_URL}/logo.png`} alt="Plebiscitum Logo" />
      <WelcomeText>
        Bem-vindo ao Plebiscitum! Participe das decisões da sua comunidade de
        forma simples e segura.
      </WelcomeText>
      <LoginButton onClick={handleLogin}>Login com Pi Network</LoginButton>
      <FooterText>
        Acesse e participe da mudança com segurança e transparência.
      </FooterText>
    </LoginContainer>
  );
};

export default Login;
