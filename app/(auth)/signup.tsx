import { useRouter } from "expo-router";
import { useState } from "react";
import {
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  StatusBar,
  Text,
  TextInput,
  View,
} from "react-native";
import { signupUser } from "../../src/services/authService";
import { colors, spacing, ui } from "../../src/Theam";

export default function Signup() {
  const router = useRouter();
  const [userName, setUserName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [focusedField, setFocusedField] = useState<string | null>(null);

  const handleSignup = async () => {
    if (!userName || !email || !password || !confirmPassword) {
      setError("Please fill in all fields.");
      return;
    }

    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    // Optional: stronger validation
    if (password.length < 6) {
      setError("Password must be at least 6 characters.");
      return;
    }

    setError("");
    setLoading(true);

    try {
      await signupUser({ userName, email, password });

      // Optional: success feedback
      // setSuccess("Account created successfully");

      router.replace("/login");

    } catch (err: any) {
      // 🔥 show actual backend / API error
      setError(err.message || "Signup failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const inputStyle = (field: string) => [
    ui.input,
    focusedField === field && ui.inputFocused,
  ];

  return (
    <KeyboardAvoidingView
      style={ui.screen}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
    >
      <StatusBar barStyle="dark-content" />

      {/* Decorative blobs — positioned relative to screen, not card */}
      <View style={ui.blobTopRight} />
      <View style={ui.blobBottomLeft} />

      <ScrollView
        contentContainerStyle={{
          flexGrow: 1,
          justifyContent: "center",
          alignItems: "center",
          padding: spacing.xl,
          paddingVertical: spacing["3xl"],
        }}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >
        <View style={[ui.card, { width: "100%", maxWidth: 400 }]}>

          {/* Logo */}
          <View style={[ui.logoMark, { marginBottom: spacing["2xl"] }]}>
            <Text style={ui.logoMarkText}>◆</Text>
          </View>

          <Text style={ui.heading}>Create account</Text>
          <Text style={[ui.subheading, { marginBottom: spacing["2xl"], marginTop: spacing.xs }]}>
            Sign up to get started
          </Text>

          {/* Error */}
          {error ? (
            <View style={ui.errorBox}>
              <Text style={ui.errorText}>{error}</Text>
            </View>
          ) : null}

          {/* Username */}
          <View style={{ marginBottom: spacing.lg }}>
            <Text style={ui.label}>Username</Text>
            <TextInput
              style={inputStyle("userName")}
              placeholder="johndoe"
              placeholderTextColor={colors.textMuted}
              value={userName}
              onChangeText={(t) => { setUserName(t); setError(""); }}
              autoCapitalize="none"
              autoCorrect={false}
              onFocus={() => setFocusedField("userName")}
              onBlur={() => setFocusedField(null)}
            />
          </View>

          {/* Email */}
          <View style={{ marginBottom: spacing.lg }}>
            <Text style={ui.label}>Email</Text>
            <TextInput
              style={inputStyle("email")}
              placeholder="you@example.com"
              placeholderTextColor={colors.textMuted}
              value={email}
              onChangeText={(t) => { setEmail(t); setError(""); }}
              keyboardType="email-address"
              autoCapitalize="none"
              autoCorrect={false}
              onFocus={() => setFocusedField("email")}
              onBlur={() => setFocusedField(null)}
            />
          </View>

          {/* Password */}
          <View style={{ marginBottom: spacing.lg }}>
            <Text style={ui.label}>Password</Text>
            <TextInput
              style={inputStyle("password")}
              placeholder="••••••••"
              placeholderTextColor={colors.textMuted}
              secureTextEntry
              value={password}
              onChangeText={(t) => { setPassword(t); setError(""); }}
              onFocus={() => setFocusedField("password")}
              onBlur={() => setFocusedField(null)}
            />
          </View>

          {/* Confirm Password */}
          <View style={{ marginBottom: spacing.xl }}>
            <Text style={ui.label}>Confirm Password</Text>
            <TextInput
              style={inputStyle("confirmPassword")}
              placeholder="••••••••"
              placeholderTextColor={colors.textMuted}
              secureTextEntry
              value={confirmPassword}
              onChangeText={(t) => { setConfirmPassword(t); setError(""); }}
              onFocus={() => setFocusedField("confirmPassword")}
              onBlur={() => setFocusedField(null)}
            />
          </View>

          {/* Sign Up button */}
          <Pressable
            style={({ pressed }) => [ui.buttonPrimary, pressed && ui.buttonPressed]}
            onPress={handleSignup}
            disabled={loading}
          >
            {loading
              ? <ActivityIndicator color={colors.textInverse} />
              : <Text style={ui.buttonPrimaryText}>Create Account</Text>
            }
          </Pressable>

          {/* Divider */}
          <View style={ui.dividerRow}>
            <View style={ui.dividerLine} />
            <Text style={ui.dividerText}>or</Text>
            <View style={ui.dividerLine} />
          </View>

          {/* Back to Login */}
          <Pressable
            style={({ pressed }) => [ui.buttonSecondary, pressed && ui.buttonPressed]}
            onPress={() => router.replace("/login")}
          >
            <Text style={ui.buttonSecondaryText}>Already have an account? Sign In</Text>
          </Pressable>

        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}