package com.example.components

import androidx.compose.foundation.Canvas
import androidx.compose.foundation.layout.size
import androidx.compose.runtime.Composable
import androidx.compose.ui.Modifier
import androidx.compose.ui.geometry.Offset
import androidx.compose.ui.geometry.Rect
import androidx.compose.ui.geometry.Size
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.graphics.Path
import androidx.compose.ui.graphics.StrokeCap
import androidx.compose.ui.graphics.drawscope.Stroke
import androidx.compose.ui.unit.Dp
import androidx.compose.ui.unit.dp
import kotlin.math.PI
import kotlin.math.cos
import kotlin.math.sin

@Composable
fun ShapeCanvas(
    shapeId: String,
    color: Color,
    modifier: Modifier = Modifier,
    size: Dp = 64.dp,
    strokeColor: Color? = null,
    strokeWidth: Float = 0f
) {
    Canvas(modifier = modifier.size(size)) {
        val w = this.size.width
        val h = this.size.height

        when (shapeId) {
            "circle" -> {
                if (color != Color.Transparent) {
                    drawCircle(color = color, radius = w * 0.42f, center = Offset(w / 2f, h / 2f))
                }
                if (strokeColor != null && strokeWidth > 0) {
                    drawCircle(color = strokeColor, radius = w * 0.42f, center = Offset(w / 2f, h / 2f), style = Stroke(strokeWidth))
                }
            }
            "square" -> {
                val pad = w * 0.12f
                val s = w - pad * 2
                val rect = Rect(pad, pad, pad + s, pad + s)
                if (color != Color.Transparent) {
                    drawRoundRect(color = color, topLeft = Offset(pad, pad), size = Size(s, s), cornerRadius = androidx.compose.ui.geometry.CornerRadius(14f, 14f))
                }
                if (strokeColor != null && strokeWidth > 0) {
                    drawRoundRect(color = strokeColor, topLeft = Offset(pad, pad), size = Size(s, s), cornerRadius = androidx.compose.ui.geometry.CornerRadius(14f, 14f), style = Stroke(strokeWidth))
                }
            }
            "triangle" -> {
                val path = Path().apply {
                    moveTo(w * 0.5f, h * 0.12f)
                    lineTo(w * 0.88f, h * 0.86f)
                    lineTo(w * 0.12f, h * 0.86f)
                    close()
                }
                if (color != Color.Transparent) drawPath(path, color)
                if (strokeColor != null && strokeWidth > 0) drawPath(path, strokeColor, style = Stroke(strokeWidth, cap = StrokeCap.Round))
            }
            "rectangle" -> {
                val left = w * 0.10f
                val top = h * 0.25f
                val rw = w * 0.80f
                val rh = h * 0.50f
                if (color != Color.Transparent) {
                    drawRoundRect(color = color, topLeft = Offset(left, top), size = Size(rw, rh), cornerRadius = androidx.compose.ui.geometry.CornerRadius(12f, 12f))
                }
                if (strokeColor != null && strokeWidth > 0) {
                    drawRoundRect(color = strokeColor, topLeft = Offset(left, top), size = Size(rw, rh), cornerRadius = androidx.compose.ui.geometry.CornerRadius(12f, 12f), style = Stroke(strokeWidth))
                }
            }
            "oval" -> {
                if (color != Color.Transparent) {
                    drawOval(color = color, topLeft = Offset(w * 0.12f, h * 0.22f), size = Size(w * 0.76f, h * 0.56f))
                }
                if (strokeColor != null && strokeWidth > 0) {
                    drawOval(color = strokeColor, topLeft = Offset(w * 0.12f, h * 0.22f), size = Size(w * 0.76f, h * 0.56f), style = Stroke(strokeWidth))
                }
            }
            "star" -> {
                val cx = w / 2f
                val cy = h / 2f
                val outer = w * 0.44f
                val inner = outer * 0.48f
                val path = Path()
                for (i in 0 until 10) {
                    val r = if (i % 2 == 0) outer else inner
                    val angle = -PI / 2.0 + i * (PI / 5.0)
                    val x = cx + (r * cos(angle)).toFloat()
                    val y = cy + (r * sin(angle)).toFloat()
                    if (i == 0) path.moveTo(x, y) else path.lineTo(x, y)
                }
                path.close()
                if (color != Color.Transparent) drawPath(path, color)
                if (strokeColor != null && strokeWidth > 0) drawPath(path, strokeColor, style = Stroke(strokeWidth, cap = StrokeCap.Round))
            }
            "heart" -> {
                val path = Path().apply {
                    moveTo(w * 0.5f, h * 0.80f)
                    cubicTo(w * 0.20f, h * 0.55f, w * 0.10f, h * 0.38f, w * 0.18f, h * 0.24f)
                    cubicTo(w * 0.28f, h * 0.08f, w * 0.45f, h * 0.16f, w * 0.5f, h * 0.28f)
                    cubicTo(w * 0.55f, h * 0.16f, w * 0.72f, h * 0.08f, w * 0.82f, h * 0.24f)
                    cubicTo(w * 0.90f, h * 0.38f, w * 0.80f, h * 0.55f, w * 0.5f, h * 0.80f)
                    close()
                }
                if (color != Color.Transparent) drawPath(path, color)
                if (strokeColor != null && strokeWidth > 0) drawPath(path, strokeColor, style = Stroke(strokeWidth, cap = StrokeCap.Round))
            }
            "diamond" -> {
                val path = Path().apply {
                    moveTo(w * 0.5f, h * 0.10f)
                    lineTo(w * 0.88f, h * 0.50f)
                    lineTo(w * 0.5f, h * 0.90f)
                    lineTo(w * 0.12f, h * 0.50f)
                    close()
                }
                if (color != Color.Transparent) drawPath(path, color)
                if (strokeColor != null && strokeWidth > 0) drawPath(path, strokeColor, style = Stroke(strokeWidth, cap = StrokeCap.Round))
            }
        }
    }
}
