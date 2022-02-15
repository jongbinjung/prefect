import { RouteLocationNormalized, RouteLocationRaw } from 'vue-router'
import { RouteGuard, RouteGuardReturn } from '../types/RouteGuard'

export class RouteGuardExecutioner {
  private static readonly global: RouteGuard[] = []

  public static async before(to: RouteLocationNormalized, from: RouteLocationNormalized): Promise<Awaited<RouteGuardReturn>> {
    const guards = this.getRouteGuards(to)

    for (const guard of guards) {
      const result = await guard.before?.(to, from)

      if (this.isRouteLocation(result)) {
        return result
      }
    }
  }

  public static after(to: RouteLocationNormalized, from: RouteLocationNormalized): void {
    const guards = this.getRouteGuards(to)

    for (const guard of guards) {
      guard.after?.(to, from)
    }
  }

  public static register(guard: RouteGuard): void {
    this.global.push(guard)
  }

  private static getRouteGuards(route: RouteLocationNormalized): RouteGuard[] {
    const routeGuards = (route.meta.guards ?? []) as RouteGuard[]

    return [...this.global, ...routeGuards]
  }

  // test this
  private static isRouteLocation(result: RouteGuardReturn): result is RouteLocationRaw {
    return typeof result === 'string' || typeof result == 'object'
  }

}