# MSM Mesh ProGuard Rules
-keepattributes *Annotation*, InnerClasses
-dontnote kotlinx.serialization.AnnotationsKt

-keepclassmembers class com.msm.mesh.data.models.** {
    *** Companion;
}
-keepclasseswithmembers class com.msm.mesh.data.models.** {
    kotlinx.serialization.KSerializer serializer(...);
}
