from rest_framework import serializers
from .models import Event, Participant, Registration



class ParticipantSerializer(serializers.ModelSerializer):

    class Meta:
        model = Participant
        fields = ['id', 'name', 'email']



class EventSerializer(serializers.ModelSerializer):

    class Meta:
        model = Event
        fields = ['id', 'title', 'description', 'date', 'status']

    def validate_date(self, value):
        from django.utils.timezone import now
        if value < now():
            raise serializers.ValidationError("Event date cannot be in the past.")
        return value



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

