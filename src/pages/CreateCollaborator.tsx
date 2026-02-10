import { useState } from "react";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { zodResolver } from "@hookform/resolvers/zod";
import { motion, AnimatePresence } from "motion/react";
import {
  Box,
  Button,
  Typography,
  Stepper,
  Step,
  StepLabel,
  Breadcrumbs,
  Link,
  LinearProgress,
} from "@mui/material";
import { InputForm, PageHeader, SwitchForm } from "@/components";
import SelectForm from "@/components/form/select.form";
import {
  createCollaboratorSchema,
  type CreateCollaboratorSchema,
} from "@/schemas";

const steps = ["Informações Básicas", "Infos Profissionais"];

const departmentOptions = [
  { value: "design", label: "Design" },
  { value: "engineering", label: "Engineering" },
  { value: "product", label: "Product" },
  { value: "marketing", label: "Marketing" },
  { value: "sales", label: "Sales" },
  { value: "hr", label: "HR" },
];

export default function CreateCollaborator() {
  const navigate = useNavigate();
  const [activeStep, setActiveStep] = useState(0);

  const {
    control,
    handleSubmit,
    formState: { errors },
    trigger,
  } = useForm<CreateCollaboratorSchema>({
    resolver: zodResolver(createCollaboratorSchema),
    defaultValues: {
      name: "",
      email: "",
      isActive: true,
      department: "",
    },
    mode: "onChange",
  });

  const progress = ((activeStep + 1) / steps.length) * 100;

  const handleNext = async () => {
    const fieldsToValidate: Array<keyof CreateCollaboratorSchema> =
      activeStep === 0 ? ["name", "email", "isActive"] : ["department"];

    const isValid = await trigger(fieldsToValidate);

    if (!isValid) return;

    if (activeStep < steps.length - 1) {
      setActiveStep((prev) => prev + 1);
    } else {
      handleSubmit(onSubmit)();
    }
  };

  const handleBack = () => {
    if (activeStep > 0) {
      setActiveStep((prev) => prev - 1);
    } else {
      navigate("/");
    }
  };

  const onSubmit = (data: CreateCollaboratorSchema) => {
    console.log("Form submitted:", data);
    navigate("/");
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

      <Box sx={{ mr: 12 }}>
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
                    <InputForm
                      name="name"
                      control={control}
                      label="Título"
                      placeholder="João da Silva"
                      error={!!errors.name}
                      helperText={errors.name?.message}
                    />

                    <InputForm
                      name="email"
                      control={control}
                      label="E-mail"
                      type="email"
                      placeholder="e.g. john@gmail.com"
                      error={!!errors.email}
                      helperText={errors.email?.message}
                    />

                    <SwitchForm
                      name="isActive"
                      control={control}
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
                    <SelectForm
                      name="department"
                      control={control}
                      label="Departamento"
                      options={departmentOptions}
                      error={!!errors.department}
                      helperText={errors.department?.message}
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
                variant="text"
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
          </Box>
        </Box>
      </Box>
    </motion.div>
  );
}
