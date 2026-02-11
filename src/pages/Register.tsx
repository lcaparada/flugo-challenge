import { useState } from "react";
import { Link, useNavigate, Navigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { motion } from "motion/react";
import { Alert, Box, Button, Typography } from "@mui/material";
import { useAuth } from "@/hooks";
import { registerSchema, type RegisterSchema } from "@/schemas";
import { InputForm, Loading } from "@/components";

export default function Register() {
  const navigate = useNavigate();
  const { user, isLoading, register: signUp } = useAuth();
  const [firebaseError, setFirebaseError] = useState<string | null>(null);
  const [isRegistering, setIsRegistering] = useState(false);

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<RegisterSchema>({
    resolver: zodResolver(registerSchema),
    defaultValues: { email: "", password: "", confirmPassword: "" },
    mode: "onChange",
  });

  if (isLoading) {
    return <Loading />;
  }

  if (user) {
    return <Navigate to="/" replace />;
  }

  const onSubmit = async (data: RegisterSchema) => {
    setFirebaseError(null);
    setIsRegistering(true);
    try {
      await signUp(data.email, data.password);
      navigate("/", { replace: true });
    } catch (err) {
      const message =
        err instanceof Error
          ? err.message
          : "Erro ao criar conta. Tente novamente.";
      setFirebaseError(message);
    } finally {
      setIsRegistering(false);
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
        component="img"
        src="/logo2.png"
        alt="Logo"
        sx={{
          width: 120,
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
          Criar conta
        </Typography>

        {firebaseError && (
          <Alert severity="error" onClose={() => setFirebaseError(null)}>
            Falha ao criar conta. Tente novamente.
          </Alert>
        )}

        <InputForm
          name="email"
          control={control}
          label="E-mail"
          type="email"
          autoComplete="email"
          error={!!errors.email}
          disabled={isRegistering || isLoading}
          helperText={errors.email?.message}
        />
        <InputForm
          name="password"
          control={control}
          label="Senha"
          type="password"
          autoComplete="new-password"
          error={!!errors.password}
          disabled={isRegistering || isLoading}
          helperText={errors.password?.message}
        />
        <InputForm
          name="confirmPassword"
          control={control}
          label="Confirmar senha"
          type="password"
          autoComplete="new-password"
          disabled={isRegistering || isLoading}
          error={!!errors.confirmPassword}
          helperText={errors.confirmPassword?.message}
        />

        <Button
          type="submit"
          variant="contained"
          color="primary"
          fullWidth
          disabled={isRegistering || isLoading}
          loading={isRegistering}
          sx={{
            mt: 1,
            textTransform: "none",
            fontWeight: 600,
            py: 1.5,
          }}
        >
          Criar conta
        </Button>

        <Typography variant="body2" sx={{ textAlign: "center", mt: 1 }}>
          Já tem conta?{" "}
          <Link
            to="/login"
            style={{
              color: "inherit",
              fontWeight: 600,
              textDecoration: "underline",
            }}
          >
            Entrar
          </Link>
        </Typography>
      </Box>
    </Box>
  );
}
