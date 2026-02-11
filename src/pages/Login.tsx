import { useState } from "react";
import { Link, useNavigate, Navigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { motion } from "motion/react";
import { Alert, Box, Button, Typography } from "@mui/material";
import { useAuth } from "@/hooks";
import { loginSchema, type LoginSchema } from "@/schemas";
import { InputForm, Loading } from "@/components";

export default function Login() {
  const navigate = useNavigate();
  const { user, isLoading, login } = useAuth();
  const [firebaseError, setFirebaseError] = useState<string | null>(null);
  const [isLoggingIn, setIsLoggingIn] = useState(false);

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginSchema>({
    resolver: zodResolver(loginSchema),
    defaultValues: { email: "", password: "" },
    mode: "onChange",
  });

  if (isLoading) {
    return <Loading />;
  }

  if (user) {
    return <Navigate to="/" replace />;
  }

  const onSubmit = async (data: LoginSchema) => {
    setFirebaseError(null);
    setIsLoggingIn(true);
    try {
      await login(data.email, data.password);
      navigate("/", { replace: true });
    } catch (err) {
      const message =
        err instanceof Error ? err.message : "Erro ao entrar. Tente novamente.";
      setFirebaseError(message);
    } finally {
      setIsLoggingIn(false);
    }
  };

  return (
    <Box
      component={motion.div}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: "easeOut" }}
      sx={{
        minHeight: "100vh",
        bgcolor: "background.default",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        px: 2,
        py: 4,
      }}
    >
      <Box
        component={motion.img}
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        src="/logo2.png"
        alt="Logo"
        sx={{
          width: 120,
          cursor: "pointer",
          height: "auto",
          objectFit: "contain",
          mb: 3,
        }}
      />
      <Box
        component="form"
        onSubmit={handleSubmit(onSubmit)}
        sx={{
          width: "100%",
          maxWidth: 400,
          display: "flex",
          flexDirection: "column",
          gap: 2,
        }}
        noValidate
      >
        <Typography
          variant="h4"
          component="h1"
          sx={{
            fontWeight: 700,
            color: "text.primary",
            textAlign: "center",
            mb: 1,
          }}
        >
          Entrar
        </Typography>

        {firebaseError && (
          <Alert severity="error" onClose={() => setFirebaseError(null)}>
            Falha ao entrar. Tente novamente.
          </Alert>
        )}
        <InputForm
          name="email"
          control={control}
          label="E-mail"
          type="email"
          autoComplete="email"
          error={!!errors.email}
          disabled={isLoggingIn || isLoading}
          helperText={errors.email?.message}
        />
        <InputForm
          name="password"
          control={control}
          label="Senha"
          type="password"
          autoComplete="current-password"
          disabled={isLoggingIn || isLoading}
          error={!!errors.password}
          helperText={errors.password?.message}
        />
        <Button
          type="submit"
          variant="contained"
          color="primary"
          fullWidth
          disabled={isLoggingIn || isLoading}
          loading={isLoggingIn}
          sx={{
            mt: 1,
            textTransform: "none",
            fontWeight: 600,
            py: 1.5,
          }}
        >
          Entrar
        </Button>

        <Typography variant="body2" sx={{ textAlign: "center", mt: 1 }}>
          Não tem conta?{" "}
          <Link
            to="/register"
            style={{
              color: "inherit",
              fontWeight: 600,
              textDecoration: "underline",
            }}
          >
            Criar conta
          </Link>
        </Typography>
      </Box>
    </Box>
  );
}
