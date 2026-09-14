from django.db import models


class College(models.Model):
    COLLEGE_TYPE_CHOICES = [
        ("IIT", "IIT"),
        ("NIT", "NIT"),
        ("IIIT", "IIIT"),
        ("GOVERNMENT", "Government"),
        ("PRIVATE", "Private"),
        ("DEEMED", "Deemed University"),
        ("OTHER", "Other"),
    ]

    name = models.CharField(
        max_length=300
    )

    short_name = models.CharField(
        max_length=100,
        blank=True
    )

    college_type = models.CharField(
        max_length=30,
        choices=COLLEGE_TYPE_CHOICES,
        default="OTHER"
    )

    city = models.CharField(
        max_length=100,
        blank=True
    )

    state = models.CharField(
        max_length=100,
        blank=True
    )

    address = models.TextField(
        blank=True
    )

    website = models.URLField(
        blank=True
    )

    description = models.TextField(
        blank=True
    )

    nirf_rank = models.PositiveIntegerField(
        null=True,
        blank=True
    )

    established_year = models.PositiveIntegerField(
        null=True,
        blank=True
    )

    average_package = models.DecimalField(
        max_digits=12,
        decimal_places=2,
        null=True,
        blank=True
    )

    highest_package = models.DecimalField(
        max_digits=12,
        decimal_places=2,
        null=True,
        blank=True
    )

    annual_fees = models.DecimalField(
        max_digits=12,
        decimal_places=2,
        null=True,
        blank=True
    )

    logo = models.URLField(
        blank=True
    )

    created_at = models.DateTimeField(
        auto_now_add=True
    )

    updated_at = models.DateTimeField(
        auto_now=True
    )

    def __str__(self):
        return self.name


class Course(models.Model):
    college = models.ForeignKey(
        College,
        on_delete=models.CASCADE,
        related_name="courses"
    )

    name = models.CharField(
        max_length=200
    )

    degree = models.CharField(
        max_length=100,
        blank=True
    )

    duration_years = models.PositiveIntegerField(
        default=4
    )

    description = models.TextField(
        blank=True
    )

    eligibility = models.TextField(
        blank=True
    )

    annual_fees = models.DecimalField(
        max_digits=12,
        decimal_places=2,
        null=True,
        blank=True
    )

    created_at = models.DateTimeField(
        auto_now_add=True
    )

    updated_at = models.DateTimeField(
        auto_now=True
    )

    def __str__(self):
        return f"{self.college.name} - {self.name}"


class Branch(models.Model):
    course = models.ForeignKey(
        Course,
        on_delete=models.CASCADE,
        related_name="branches"
    )

    name = models.CharField(
        max_length=200
    )

    code = models.CharField(
        max_length=50,
        blank=True
    )

    duration_years = models.PositiveIntegerField(
        default=4
    )

    seats = models.PositiveIntegerField(
        null=True,
        blank=True
    )

    eligibility = models.TextField(
        blank=True
    )

    created_at = models.DateTimeField(
        auto_now_add=True
    )

    updated_at = models.DateTimeField(
        auto_now=True
    )

    def __str__(self):
        return f"{self.course.name} - {self.name}"


class CollegeCutoff(models.Model):
    CATEGORY_CHOICES = [
        ("OPEN", "Open"),
        ("EWS", "EWS"),
        ("OBC_NCL", "OBC-NCL"),
        ("SC", "SC"),
        ("ST", "ST"),
    ]

    GENDER_CHOICES = [
        ("OPEN", "Open"),
        ("FEMALE", "Female"),
    ]

    college = models.ForeignKey(
        College,
        on_delete=models.CASCADE,
        related_name="cutoffs"
    )

    branch = models.ForeignKey(
        Branch,
        on_delete=models.CASCADE,
        related_name="cutoffs"
    )

    category = models.CharField(
        max_length=20,
        choices=CATEGORY_CHOICES,
        default="OPEN"
    )

    gender = models.CharField(
        max_length=20,
        choices=GENDER_CHOICES,
        default="OPEN"
    )

    home_state = models.CharField(
        max_length=100,
        blank=True
    )

    year = models.PositiveIntegerField()

    opening_rank = models.PositiveIntegerField()

    closing_rank = models.PositiveIntegerField()

    round_number = models.PositiveIntegerField(
        default=1
    )

    created_at = models.DateTimeField(
        auto_now_add=True
    )

    updated_at = models.DateTimeField(
        auto_now=True
    )

    class Meta:
        ordering = ["closing_rank"]

    def __str__(self):
        return (
            f"{self.college.short_name} - "
            f"{self.branch.name} - "
            f"{self.category} - "
            f"{self.year}"
        )