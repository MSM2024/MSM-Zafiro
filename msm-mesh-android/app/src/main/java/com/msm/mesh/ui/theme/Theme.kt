package com.msm.mesh.ui.theme

import androidx.compose.foundation.isSystemInDarkTheme
import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.darkColorScheme
import androidx.compose.runtime.Composable

private val MeshColorScheme = darkColorScheme(
    primary = Cyan500,
    secondary = Cyan400,
    tertiary = Amber400,
    background = DarkBg,
    surface = DarkSurface,
    surfaceVariant = DarkCard,
    onPrimary = DarkBg,
    onSecondary = DarkBg,
    onBackground = TextPrimary,
    onSurface = TextPrimary,
    onSurfaceVariant = TextSecondary,
    error = Red400,
)

@Composable
fun MSMMeshTheme(content: @Composable () -> Unit) {
    MaterialTheme(colorScheme = MeshColorScheme, content = content)
}
