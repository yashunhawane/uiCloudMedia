import { useRouter } from "expo-router";
import { useState } from "react";
import {
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  StatusBar,
  Text,
  TextInput,
  View,
} from "react-native";
import { loginUser } from "../../src/services/authService";
import { colors, spacing, ui } from "../../src/Theam"; // ← one import, everything available

export default function Login() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [emailFocused, setEmailFocused] = useState(false);
  const [passwordFocused, setPasswordFocused] = useState(false);

  const handleLogin = async () => {
    if (!email || !password) {
      setError("Please fill in all fields.");
      return;
    }

    setError("");
    setLoading(true);

    try {
      await loginUser({ email, password });
      router.replace("/home");

    } catch (err: any) {
      setError(err?.message || "Login failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView
      style={[ui.screen, ui.centered, { padding: spacing.xl }]}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
    >
      <StatusBar barStyle="dark-content" />

      {/* Decorative blobs — straight from theme */}
      <View style={ui.blobTopRight} />
      <View style={ui.blobBottomLeft} />

      <View style={[ui.card, { width: "100%", maxWidth: 400 }]}>

        {/* Logo */}
        <View style={[ui.logoMark, { marginBottom: spacing["2xl"] }]}>
          <Text style={ui.logoMarkText}>◆</Text>
        </View>

        <Text style={ui.heading}>Welcome back</Text>
        <Text style={[ui.subheading, { marginBottom: spacing["2xl"], marginTop: spacing.xs }]}>
          Sign in to continue
        </Text>

        {/* Error */}
        {error ? (
          <View style={ui.errorBox}>
            <Text style={ui.errorText}>{error}</Text>
          </View>
        ) : null}

        {/* Email */}
        <View style={{ marginBottom: spacing.lg }}>
          <Text style={ui.label}>Email</Text>
          <TextInput
            style={[ui.input, emailFocused && ui.inputFocused]}
            placeholder="you@example.com"
            placeholderTextColor={colors.textMuted}
            onChangeText={(t) => { setEmail(t); setError(""); }}
            value={email}
            keyboardType="email-address"
            autoCapitalize="none"
            autoCorrect={false}
            onFocus={() => setEmailFocused(true)}
            onBlur={() => setEmailFocused(false)}
          />
        </View>

        {/* Password */}
        <View style={{ marginBottom: spacing.sm }}>
          <Text style={ui.label}>Password</Text>
          <TextInput
            style={[ui.input, passwordFocused && ui.inputFocused]}
            placeholder="••••••••"
            placeholderTextColor={colors.textMuted}
            secureTextEntry
            onChangeText={(t) => { setPassword(t); setError(""); }}
            value={password}
            onFocus={() => setPasswordFocused(true)}
            onBlur={() => setPasswordFocused(false)}
          />
        </View>

        {/* Forgot password */}
        {/* <Pressable
          onPress={() => router.push("/forgot-password")}
          style={{ alignSelf: "flex-end", marginBottom: spacing.xl }}
        >
          <Text style={ui.linkText}>Forgot password?</Text>
        </Pressable> */}

        {/* Sign In */}
        <Pressable
          style={({ pressed }) => [ui.buttonPrimary, pressed && ui.buttonPressed]}
          onPress={handleLogin}
          disabled={loading}
        >
          {loading
            ? <ActivityIndicator color={colors.textInverse} />
            : <Text style={ui.buttonPrimaryText}>Sign In</Text>
          }
        </Pressable>

        {/* Divider */}
        <View style={ui.dividerRow}>
          <View style={ui.dividerLine} />
          <Text style={ui.dividerText}>or</Text>
          <View style={ui.dividerLine} />
        </View>

        {/* Sign Up */}
        <Pressable
          style={({ pressed }) => [ui.buttonSecondary, pressed && ui.buttonPressed]}
          onPress={() => router.push("/signup")}
        >
          <Text style={ui.buttonSecondaryText}>Create an Account</Text>
        </Pressable>

      </View>
    </KeyboardAvoidingView>
  );
}
