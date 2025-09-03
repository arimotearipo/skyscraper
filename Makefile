CC=gcc
CFLAGS=-Wall -Wextra -std=c99 -O2
TARGET=skyscraper
SOURCE=skyscraper.c

$(TARGET): $(SOURCE)
	$(CC) $(CFLAGS) -o $(TARGET) $(SOURCE)

clean:
	rm -f $(TARGET) solutions.txt

.PHONY: clean