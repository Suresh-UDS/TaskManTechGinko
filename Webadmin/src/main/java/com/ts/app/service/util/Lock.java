package com.ts.app.service.util;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

public class Lock {

	private static final Logger logger = LoggerFactory.getLogger(Lock.class);
	private boolean isLocked = false;

	public synchronized void lock() throws InterruptedException {
		logger.debug("Entering to acquire lock");
		while (isLocked) {
			logger.debug("Waiting to acquire lock");
			wait();
		}
		logger.debug("Acquired lock");
		isLocked = true;
	}

	public synchronized void unlock() {
		isLocked = false;
		logger.debug("Released lock");
		notify();
	}

	public synchronized boolean isLocked() {
		return isLocked;
	}
}