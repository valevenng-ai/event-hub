from rest_framework import serializers
from .models import Event, Participant, Registration


# ─────────────────────────────────────────────
# PARTICIPANT
# ─────────────────────────────────────────────

class ParticipantSerializer(serializers.ModelSerializer):

    class Meta:
        model = Participant
        fields = ['id', 'name', 'email']

    def validate_email(self, value):
        """Email en minuscules + unicité vérifiée à la mise à jour."""
        value = value.lower()
        qs = Participant.objects.filter(email=value)
        if self.instance:
            qs = qs.exclude(pk=self.instance.pk)
        if qs.exists():
            raise serializers.ValidationError("Un participant avec cet email existe déjà.")
        return value


# ─────────────────────────────────────────────
# EVENT
# ─────────────────────────────────────────────

class EventSerializer(serializers.ModelSerializer):

    class Meta:
        model = Event
        fields = ['id', 'title', 'description', 'date', 'status']


# ─────────────────────────────────────────────
# REGISTRATION
# ─────────────────────────────────────────────

class RegistrationSerializer(serializers.ModelSerializer):
    """
    En lecture : affiche les détails du participant et de l'événement.
    En écriture : on passe les IDs (participant, event).
    """

    # Lecture : objets imbriqués
    participant_detail = ParticipantSerializer(source='participant', read_only=True)
    event_detail       = EventSerializer(source='event', read_only=True)

    # Écriture : IDs uniquement
    participant = serializers.PrimaryKeyRelatedField(
        queryset=Participant.objects.all(),
        write_only=True
    )
    event = serializers.PrimaryKeyRelatedField(
        queryset=Event.objects.all(),
        write_only=True
    )

    class Meta:
        model = Registration
        fields = [
            'id',
            'participant',        # écriture
            'event',              # écriture
            'participant_detail', # lecture
            'event_detail',       # lecture
            'registered_at',
        ]
        read_only_fields = ['id', 'registered_at']

    def validate(self, data):
        """Empêche la double inscription."""
        participant = data.get('participant')
        event       = data.get('event')

        if self.instance is None:
            if Registration.objects.filter(participant=participant, event=event).exists():
                raise serializers.ValidationError(
                    f"{participant.name} est déjà inscrit(e) à l'événement '{event.title}'."
                )
        return data


# ─────────────────────────────────────────────
# EVENT DETAIL (avec liste des inscrits)
# ─────────────────────────────────────────────

class RegistrationListSerializer(serializers.ModelSerializer):
    """Version légère pour lister les inscrits d'un événement."""

    participant = ParticipantSerializer(read_only=True)

    class Meta:
        model = Registration
        fields = ['id', 'participant', 'registered_at']


class EventDetailSerializer(EventSerializer):
    """
    Étend EventSerializer en ajoutant la liste des participants inscrits.
    Utilisé uniquement en GET /events/{id}/.
    """

    registrations = RegistrationListSerializer(many=True, read_only=True)

    class Meta(EventSerializer.Meta):
        fields = EventSerializer.Meta.fields + ['registrations']