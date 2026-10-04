from django.http import JsonResponse

from clinic.auth import authdog


def index(request):
    return JsonResponse(
        {
            "sample": "Clinic portal",
            "hint": "GET /me with an authdog-session cookie or Authorization: Bearer <token>",
        }
    )


@authdog.require_auth
def me(request):
    return JsonResponse(authdog.session(request).user)
