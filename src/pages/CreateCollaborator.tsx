import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "motion/react";
import {
  Box,
  Button,
  TextField,
  Switch,
  FormControlLabel,
  Typography,
  Stepper,
  Step,
  StepLabel,
  Paper,
  Breadcrumbs,
  Link,
  LinearProgress,
} from "@mui/material";
import { PageHeader } from "@/components";
import type { CollaboratorFormData } from "@/types/collaboratorForm";
import { initialFormData } from "@/types/collaboratorForm";

const steps = ["Infos Básicas", "Infos Profissionais"];

export default function CreateCollaborator() {
  const navigate = useNavigate();
  const [activeStep, setActiveStep] = useState(0);
  const [formData, setFormData] =
    useState<CollaboratorFormData>(initialFormData);

  const progress = ((activeStep + 1) / steps.length) * 100;

  const handleNext = () => {
    if (activeStep < steps.length - 1) {
      setActiveStep((prev) => prev + 1);
    } else {
      console.log("Form data:", formData);
      navigate("/");
    }
  };

  const handleBack = () => {
    if (activeStep > 0) {
      setActiveStep((prev) => prev - 1);
    } else {
      navigate("/");
    }
  };

  const handleChange =
    (field: keyof CollaboratorFormData) =>
    (event: React.ChangeEvent<HTMLInputElement>) => {
      setFormData((prev) => ({
        ...prev,
        [field]: event.target.value,
      }));
    };

  const handleSwitchChange =
    (field: keyof CollaboratorFormData) =>
    (event: React.ChangeEvent<HTMLInputElement>) => {
      setFormData((prev) => ({
        ...prev,
        [field]: event.target.checked,
      }));
    };

  return (
    <motion.div
      className="w-full bg-background min-h-screen px-8 py-6"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: "easeOut" }}
    >
      <PageHeader />

      <Breadcrumbs sx={{ mb: 3 }}>
        <Link
          underline="hover"
          color="inherit"
          href="/"
          onClick={(e) => {
            e.preventDefault();
            navigate("/");
          }}
          sx={{ cursor: "pointer" }}
        >
          Colaboradores
        </Link>
        <Typography color="text.primary">Cadastrar Colaborador</Typography>
      </Breadcrumbs>

      <Box sx={{ mb: 3 }}>
        <Box sx={{ display: "flex", justifyContent: "flex-end", mb: 1 }}>
          <Typography variant="body2" color="text.secondary">
            {Math.round(progress)}%
          </Typography>
        </Box>
        <LinearProgress
          variant="determinate"
          value={progress}
          sx={{
            height: 6,
            borderRadius: 3,
            backgroundColor: "grey.100",
            "& .MuiLinearProgress-bar": {
              borderRadius: 3,
              backgroundColor: "primary.main",
            },
          }}
        />
      </Box>

      <Box sx={{ display: "flex", gap: 4 }}>
        <Box sx={{ width: 240 }}>
          <Stepper activeStep={activeStep} orientation="vertical">
            {steps.map((label, index) => (
              <Step key={label}>
                <StepLabel
                  sx={{
                    "& .MuiStepLabel-label": {
                      fontSize: "1rem",
                      fontWeight: index === activeStep ? 600 : 400,
                    },
                  }}
                >
                  {label}
                </StepLabel>
              </Step>
            ))}
          </Stepper>
        </Box>

        <Box sx={{ flex: 1 }}>
          <Paper
            elevation={0}
            sx={{
              p: 4,
              borderRadius: 2,
              border: "1px solid",
              borderColor: "grey.100",
            }}
          >
            <Typography
              variant="h5"
              sx={{ mb: 4, fontWeight: 600, color: "text.primary" }}
            >
              {steps[activeStep]}
            </Typography>

            <AnimatePresence mode="wait">
              {activeStep === 0 && (
                <motion.div
                  key="step-0"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.3, ease: "easeInOut" }}
                >
                  <Box
                    sx={{ display: "flex", flexDirection: "column", gap: 3 }}
                  >
                    <TextField
                      label="Título"
                      value={formData.name}
                      onChange={handleChange("name")}
                      fullWidth
                      variant="outlined"
                      placeholder="João da Silva"
                      sx={{
                        "& .MuiOutlinedInput-root": {
                          borderRadius: 2,
                        },
                      }}
                    />

                    <TextField
                      label="E-mail"
                      type="email"
                      value={formData.email}
                      onChange={handleChange("email")}
                      fullWidth
                      variant="outlined"
                      placeholder="e.g. john@gmail.com"
                      sx={{
                        "& .MuiOutlinedInput-root": {
                          borderRadius: 2,
                        },
                      }}
                    />

                    <FormControlLabel
                      control={
                        <Switch
                          checked={formData.isActive}
                          onChange={handleSwitchChange("isActive")}
                          color="primary"
                        />
                      }
                      label="Ativar ao criar"
                    />
                  </Box>
                </motion.div>
              )}

              {activeStep === 1 && (
                <motion.div
                  key="step-1"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.3, ease: "easeInOut" }}
                >
                  <Box
                    sx={{ display: "flex", flexDirection: "column", gap: 3 }}
                  >
                    <TextField
                      label="Departamento"
                      value={formData.department}
                      onChange={handleChange("department")}
                      fullWidth
                      variant="outlined"
                      placeholder="e.g. Design"
                      sx={{
                        "& .MuiOutlinedInput-root": {
                          borderRadius: 2,
                        },
                      }}
                    />

                    <TextField
                      label="Cargo"
                      value={formData.role}
                      onChange={handleChange("role")}
                      fullWidth
                      variant="outlined"
                      placeholder="e.g. Designer Senior"
                      sx={{
                        "& .MuiOutlinedInput-root": {
                          borderRadius: 2,
                        },
                      }}
                    />

                    <TextField
                      label="Salário"
                      value={formData.salary}
                      onChange={handleChange("salary")}
                      fullWidth
                      variant="outlined"
                      placeholder="e.g. R$ 5.000,00"
                      sx={{
                        "& .MuiOutlinedInput-root": {
                          borderRadius: 2,
                        },
                      }}
                    />

                    <TextField
                      label="Data de Início"
                      type="date"
                      value={formData.startDate}
                      onChange={handleChange("startDate")}
                      fullWidth
                      variant="outlined"
                      InputLabelProps={{
                        shrink: true,
                      }}
                      sx={{
                        "& .MuiOutlinedInput-root": {
                          borderRadius: 2,
                        },
                      }}
                    />
                  </Box>
                </motion.div>
              )}
            </AnimatePresence>

            <Box
              sx={{
                display: "flex",
                justifyContent: "space-between",
                mt: 4,
              }}
            >
              <Button
                onClick={handleBack}
                variant="outlined"
                color="secondary"
                sx={{
                  borderRadius: 2,
                  textTransform: "none",
                  fontWeight: 600,
                  px: 4,
                }}
              >
                Voltar
              </Button>

              <Button
                onClick={handleNext}
                variant="contained"
                color="primary"
                sx={{
                  borderRadius: 2,
                  textTransform: "none",
                  fontWeight: 600,
                  px: 4,
                }}
              >
                {activeStep === steps.length - 1 ? "Finalizar" : "Próximo"}
              </Button>
            </Box>
          </Paper>
        </Box>
      </Box>
    </motion.div>
  );
}
